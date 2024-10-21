import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
