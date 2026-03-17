import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../ui/Card';

const MonthlyBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1rem 0', alignSelf: 'flex-start' }}>Monthly Spending</h3>
        <p style={{ color: 'var(--text-secondary)' }}>No expense data available.</p>
      </Card>
    );
  }

  return (
    <Card style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Monthly Spending</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'var(--border-color)', opacity: 0.4 }}
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--primary)' }}
              formatter={(value) => [`$${value}`, 'Amount']}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="var(--primary)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MonthlyBarChart;
