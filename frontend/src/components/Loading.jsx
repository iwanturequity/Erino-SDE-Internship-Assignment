const Loading = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div 
        className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
        style={{ animation: 'spin 1s linear infinite' }}
      ></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;
