import { useSettings } from "./contexts/SettingsContext";

const ReadingBlur: React.FC = () => {
  const { settings } = useSettings();

  return (
    !settings.disableBackgroundBlur && (
      <div className="flex justify-center items-center fixed inset-0 -z-5 backdrop-blur pointer-events-none h-full w-full select-none" />
    )
  );
};

export default ReadingBlur;
