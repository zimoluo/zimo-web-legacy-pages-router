import { useEffect, useState } from 'react';

const BlurOverlay: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);

    const handleResize = () => {
      setLoaded(false);
      setTimeout(() => setLoaded(true), 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity ease-linear duration-100 ${loaded ? 'opacity-0' : 'opacity-100'} backdrop-blur-2xl pointer-events-none`}
      aria-hidden="true"
    >
    </div>
  );
};

export default BlurOverlay;
