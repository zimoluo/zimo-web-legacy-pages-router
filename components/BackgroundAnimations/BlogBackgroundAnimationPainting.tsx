import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const BlogBackgroundAnimationPainting = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Optional: chatgpt. It really doesn't fit the art style so I removed it.
    const images: string[] = ['mountain', 'tower', 'eunoe'];
    const randomIndex = Math.floor(Math.random() * images.length);
    setSelectedImage(images[randomIndex]);
  }, []);

  return selectedImage ? (
    <Image
      src={`/blog-painting-${selectedImage}.svg`}
      alt="Blog Painting"
      height="0"
      width="0"
      className={`absolute pointer-events-none painting-size`}
      placeholder='empty'
      priority={true}
    />
  ) : null;
};

export default BlogBackgroundAnimationPainting;
