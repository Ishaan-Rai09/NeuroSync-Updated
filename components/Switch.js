import React from 'react';

const Switch = ({ isOn, handleToggle, id }) => {
  return (
    <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name={id}
        id={id}
        checked={isOn}
        onChange={handleToggle}
        className="hidden"
      />
      <label
        htmlFor={id}
        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
          isOn ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
            isOn ? 'translate-x-5' : 'translate-x-0'
          }`}
          style={{ marginTop: '2px', marginLeft: '2px' }}
        ></span>
      </label>
    </div>
  );
};

export default Switch; 