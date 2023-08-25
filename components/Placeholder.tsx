interface PlaceholderProps {
  children: React.ReactNode;
}

const Placeholder: React.FC<PlaceholderProps> = ({ children }) => {
  return (
    <div style={{ height: '1000px' }}>
      {children}
    </div>
  );
};

export default Placeholder;
