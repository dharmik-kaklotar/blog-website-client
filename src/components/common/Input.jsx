import React from 'react';


const Input = (
  ({ className = '', ...props }, ref) => {
    const classes = `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`;
    
    return (
      <input ref={ref} className={classes} {...props} />
    );
  }
);

Input.displayName = 'Input';

export default Input;
