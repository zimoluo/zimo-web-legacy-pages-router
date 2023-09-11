import {
  ThemeType,
  barColorMap,
  menuEntryBorderMap,
} from "@/interfaces/themeMaps";
import { useUser } from "./contexts/UserContext";
import GoogleSignInButton from "./GoogleSignInButton";
import MenuUserCard from "./MenuUserCard";
import MenuNavigationEntry from "./MenuNavigationEntry";
import SettingsFlip from "./SettingsFlip";
import { useSettings } from "./contexts/SettingsContext";
import SettingsNotchBar from "./SettingsSlider";

type Props = {
  theme: ThemeType;
};

const MenuContent = ({ theme }: Props) => {
  const { user } = useUser();
  const { settings, updateSettings } = useSettings();
  const borderColorClass = menuEntryBorderMap[theme];
  const barColorClass = barColorMap[theme];

  const settingsNameMap: { [key: string]: string } = {
    syncSettings: "Sync Settings",
    backgroundRichness: "Background Richness",
    navigationBar: "Navigation Bar",
    disableCenterPainting: "Disable Center Blog Art",
    disableComments: "Disable Comments",
    disableGestures: "Disable Gestures",
    disableSerifFont: "Disable Serif Font",
  };

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden px-6 md:px-8 py-8">
      <div
        className={`rounded-full w-full ${barColorClass} shadow-lg px-4 py-4 mt-6 mb-14 ${borderColorClass} border-menu-entry border-opacity-20 flex items-center`}
      >
        {user === null ? (
          <GoogleSignInButton />
        ) : (
          <MenuUserCard theme={theme} />
        )}
      </div>

      <div
        className={`rounded-2xl w-full ${barColorClass} shadow-lg px-6 py-0 my-6 text-lg font-bold md:text-xl ${borderColorClass} border-menu-entry border-opacity-20`}
      >
        {["home", "photos", "blog", "projects", "about"].map((item) => (
          <MenuNavigationEntry
            key={item}
            item={item as "home" | "photos" | "blog" | "projects" | "about"}
            theme={theme}
          />
        ))}
      </div>

      <div
        className={`rounded-2xl w-full ${barColorClass} shadow-lg px-6 py-0 my-6 ${borderColorClass} border-menu-entry border-opacity-20`}
      >
        {[
          "syncSettings",
          "disableCenterPainting",
          "disableComments",
          "disableGestures",
          "disableSerifFont",
        ].map((item, index, array) => (
          <>
            <div className="flex items-center my-4 ">
              <div className="flex-grow text-lg md:text-xl">
                {settingsNameMap[item]}
              </div>
              <SettingsFlip
                key={item}
                onClick={(status: boolean) => {
                  updateSettings({ [item]: status } as Partial<SettingsState>);
                }}
                theme={theme}
                state={
                  (settings as unknown as Record<string, unknown>)[
                    item
                  ] as boolean
                }
              />
            </div>
            {index !== array.length - 1 && (
              <div
                className={`my-0 ${borderColorClass} border-menu-rule border-opacity-20`}
              ></div>
            )}
          </>
        ))}
      </div>

      <SettingsNotchBar
        onClick={(data) => {
          console.log("Setting changed:", data);
          // Here you can use data.key and data.value for other tasks.
        }}
        values={["Slow", "Medium", "Fast"]}
        theme={theme}
      />

      <div className="overflow-auto">{JSON.stringify(user)}</div>
    </div>
  );
};

export default MenuContent;
