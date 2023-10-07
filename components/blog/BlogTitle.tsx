interface BlogTitleProps {
  className?: string;
  children: React.ReactNode;
}

const BlogTitle: React.FC<BlogTitleProps> = ({ className = "", children }) => {
  return (
    <h1
      className={`${className} font-bold text-4xl text-fuchsia-900 leading-relaxed`}
    >
      {children}
    </h1>
  );
};

export default BlogTitle;
