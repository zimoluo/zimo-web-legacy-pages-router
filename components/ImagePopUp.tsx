import Image from 'next/image';

interface Props {
  src: string;
  onClose: () => void;
}

const ImagePopUp: React.FC<Props> = ({ src, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-12 py-12">
      <Image
        src={src}
        alt="Uncropped Image"
        className='image-popup-size object-contain'
        height={800}
        width={800}
      />
      <button
        className="absolute top-2 right-2 z-50"
        onClick={onClose}
      >
        <Image
          src="/projects-zimo.svg" // Replace with your close icon sprite path
          alt="Close Image Window"
          width={32}
          height={32}
          className="h-8 w-auto"
        />
      </button>
    </div>
  );
};

export default ImagePopUp;
