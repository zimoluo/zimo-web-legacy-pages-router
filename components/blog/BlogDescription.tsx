interface BlogDescriptionProps {
    className?: string;
    children: React.ReactNode;
  }
  
  const BlogDescription: React.FC<BlogDescriptionProps> = ({ className, children }) => {
    return (
      <div className={`${className} text-xl text-fuchsia-800 opacity-70 mt-4`}>
        {children}
      </div>
    );
  };
  
  export default BlogDescription;
  