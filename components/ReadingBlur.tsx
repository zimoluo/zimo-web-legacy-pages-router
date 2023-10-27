import { useSettings } from "./contexts/SettingsContext";

interface Props {
  className?: string;
}

const ReadingBlur: React.FC<Props> = ({ className = "" }) => {
  const { settings } = useSettings();

  return (
    !settings.disableBackgroundBlur && (
      <div
        className={`flex justify-center items-center fixed inset-0 -z-5 backdrop-blur pointer-events-none h-full w-full select-none ${className}`}
      />
    )
  );
};

export default ReadingBlur;
