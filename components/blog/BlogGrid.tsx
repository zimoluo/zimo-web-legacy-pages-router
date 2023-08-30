import Image from 'next/image';
import { formatDate, getAuthorImageSrc, readingTime } from '@/lib/blog/util';

interface BlogGridProps {
    authorId: string;
    author: string;
    content: string;
    date: string;
}


const BlogGrid = ({ authorId, author, content, date }: BlogGridProps) => {
    const readTime = readingTime(content);
  
    return (
      <div className="flex my-10">
        <div className="row-span-2 flex justify-center items-center w-10 h-auto mr-4">
          <div className="w-full h-auto rounded-full overflow-hidden flex justify-center items-center">
            <Image
              src={`${getAuthorImageSrc(authorId)}`}
              alt={`${author}'s Profile`}
              className='h-full w-fit'
              width={50}
              height={50}
            />
          </div>
        </div>

        <div className="grid grid-rows-2">
          <div className="flex justify-start items-center">
            <p className='text-md'>{author}</p>
          </div>
    

          <div className="flex justify-start items-center">
            <p className='text-fuchsia-800 text-sm opacity-70'>{`${readTime}  ·  ${formatDate(date)}`}</p>
          </div>
        </div>
  
        
      </div>
    );
  };
  
export default BlogGrid;