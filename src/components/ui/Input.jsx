import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  id, 
  error, 
  className = '', 
  type = 'text',
  options, // for select type
  ...props 
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-group">
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      {type === 'select' ? (
        <select 
          id={inputId} 
          className={`form-select ${className}`} 
          ref={ref} 
          {...props}
        >
          <option value="" disabled>Select an option</option>
          {options?.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : (
        <input 
          type={type} 
          id={inputId} 
          className={`form-input ${className}`} 
          ref={ref}
          {...props} 
        />
      )}
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
