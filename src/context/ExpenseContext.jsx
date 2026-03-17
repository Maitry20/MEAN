import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query, 
  where,
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

const ExpenseContext = createContext();

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Manage User Profile & Account ID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          // Create initial profile if missing
          const initialProfile = {
            uid: user.uid,
            email: user.email.toLowerCase(),
            name: user.displayName || 'User',
            accountId: user.uid // Default account is their own UID
          };
          await setDoc(userDocRef, initialProfile);
          setUserProfile(initialProfile);
        }
      } else {
        setUserProfile(null);
        setExpenses([]);
        setMembers([]);
        setPendingInvites([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Sync Expenses based on accountId
  useEffect(() => {
    if (!userProfile?.accountId) return;

    const q = query(
      collection(db, 'expenses'), 
      where('accountId', '==', userProfile.accountId),
      orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(expenseData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile?.accountId]);

  // 3. Sync Members based on accountId
  useEffect(() => {
    if (!userProfile?.accountId) return;

    const q = query(
      collection(db, 'members'),
      where('accountId', '==', userProfile.accountId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memberData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (memberData.length === 0) {
        // Initialize with primary user if empty
        setMembers([{ id: 'm1', name: userProfile.name, email: userProfile.email }]);
      } else {
        setMembers(memberData);
      }
    });

    return () => unsubscribe();
  }, [userProfile?.accountId]);

  // 4. Listen for Pending Invites
  useEffect(() => {
    if (!userProfile?.email) return;

    const q = query(
      collection(db, 'invites'),
      where('toEmail', '==', userProfile.email.toLowerCase()),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inviteData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPendingInvites(inviteData);
    });

    return () => unsubscribe();
  }, [userProfile?.email]);

  const addExpense = async (newExpense) => {
    if (!userProfile?.accountId) return;
    try {
      await addDoc(collection(db, 'expenses'), {
        ...newExpense,
        accountId: userProfile.accountId,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  const sendInvite = async (email) => {
    if (!userProfile?.accountId) return;
    try {
      await addDoc(collection(db, 'invites'), {
        fromEmail: userProfile.email,
        fromName: userProfile.name,
        toEmail: email.toLowerCase(),
        accountId: userProfile.accountId,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      // Also add to members collection as "Invited"
      await addDoc(collection(db, 'members'), {
        name: email,
        email: email.toLowerCase(),
        accountId: userProfile.accountId,
        status: 'invited'
      });
    } catch (error) {
      console.error("Error sending invite: ", error);
    }
  };

  const acceptInvite = async (invite) => {
    try {
      // 1. Update user's accountId to the inviter's accountId
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        accountId: invite.accountId
      });

      // 2. Update invite status
      const inviteDocRef = doc(db, 'invites', invite.id);
      await updateDoc(inviteDocRef, {
        status: 'accepted'
      });

      // 3. Update member entry in Firestore
      const membersRef = collection(db, 'members');
      const qMembers = query(membersRef, where('email', '==', userProfile.email.toLowerCase()), where('accountId', '==', invite.accountId));
      const querySnapshot = await getDocs(qMembers);
      
      querySnapshot.forEach(async (memberDoc) => {
        await updateDoc(doc(db, 'members', memberDoc.id), {
          status: 'accepted',
          name: userProfile.name // Update to their actual name
        });
      });
      
      // Refresh user profile local state
      setUserProfile(prev => ({ ...prev, accountId: invite.accountId }));
      
    } catch (error) {
      console.error("Error accepting invite: ", error);
    }
  };

  const declineInvite = async (invite) => {
    try {
      const inviteDocRef = doc(db, 'invites', invite.id);
      await updateDoc(inviteDocRef, {
        status: 'declined'
      });
    } catch (error) {
      console.error("Error declining invite: ", error);
    }
  };

  return (
    <ExpenseContext.Provider value={{ 
      expenses, 
      addExpense, 
      members,
      sendInvite,
      pendingInvites,
      acceptInvite,
      declineInvite,
      userProfile,
      loading
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};


