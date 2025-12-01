//import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-10 w-full">
      <div
        className="
          animate-spin 
          rounded-full 
          h-12 w-12 
          border-4 
          border-gray-200 
          border-t-blue-600
        "
      ></div>
    </div>
  );
};

export default Spinner;