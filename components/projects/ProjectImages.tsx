import React from 'react';
import Masonry from 'react-masonry-css';
import Image from 'next/image';

type Props = {
  images: string[]
};

const ProjectImages: React.FC<Props> = ({ images }) => {
  const breakpointColumnsObj = {
    default: 2,
    768: 1,
  };

  const imageElements = images.map((url, index) => (
    <div key={index} className='py-0'>
      <Image 
        src={url} 
        alt={`masonry-item-${index}`} 
        width={500} 
        height={300} 
        className='w-full h-full object-fill'
      />
    </div>
  ));

  return (
    <div className='pb-10 pt-14'>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex w-auto"
        columnClassName="bg-clip-padding"
      >
        {imageElements}
      </Masonry>
    </div>
  );
};

export default ProjectImages;
