import Image from 'next/image';
import BlogBackgroundAnimationPainting from './BlogBackgroundAnimationPainting';

const BlogBackgroundAnimation = () => {
  return (
    <>
      <div className="fixed inset-0 -z-20 flex items-center justify-center h-screen pointer-events-none opacity-40">
        <Image
          src="/blog-pane-eunoe.svg" 
          alt="Eunoe Text"
          height="0"
          width="0"
          layout="fixed"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="fixed inset-0 flex justify-center items-center pointer-events-none -z-10">
        <Image
          src="/blog-painting-base-glow.svg"
          alt="Blog Painting"
          height="0"
          width="0"
          layout="fixed"
          className="absolute pointer-events-none painting-size animate-move-painting-glow"
        />
        <Image
          src="/blog-painting-base-orb.svg"
          alt="Blog Painting"
          height="0"
          width="0"
          layout="fixed"
          className="absolute pointer-events-none painting-size"
        />
        <BlogBackgroundAnimationPainting />
      </div>
    </>
  );
};

export default BlogBackgroundAnimation;
