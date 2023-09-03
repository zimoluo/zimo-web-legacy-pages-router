import Image from 'next/image';

interface Props {
  onClose: () => void;
}

const ImagePopUp: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40 px-12 py-12" />
  );
};

export default ImagePopUp;
