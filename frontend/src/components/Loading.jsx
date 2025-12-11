import { FiLoader } from 'react-icons/fi';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 min-h-[40vh] bg-softSand">
      <FiLoader className="w-10 h-10 text-graphite animate-spin-slow" />
      <p className="mt-4 text-graphite font-medium text-lg animate-fadeIn">{text}</p>
    </div>
  );
};

export default Loading;
