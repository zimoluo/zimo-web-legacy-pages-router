import {
  ThemeType,
  barColorMap,
  menuEntryBorderMap,
} from "@/interfaces/themeMaps";
import { useUser } from "../contexts/UserContext";
import GoogleSignInButton from "../GoogleSignInButton";
import MenuUserCard from "./MenuUserCard";
import MenuNavigationEntry from "./MenuNavigationEntry";
import SettingsFlip from "../SettingsFlip";
import { useSettings } from "../contexts/SettingsContext";
import SettingsNotchBar from "../SettingsSlider";
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import SettingsUtilityButton from "../SettingsUtilityButton";
import { securityCommentShutDown } from "@/lib/constants";
import { isHalloweenSeason } from "@/lib/seasonUtil";
import { useClientSideFlag } from "@/lib/clientLogicHooks";

type Props = {
  theme: ThemeType;
};

const MenuContent = ({ theme }: Props) => {
  const { user } = useUser();
  const { settings, updateSettings } = useSettings();

  const isHalloweenSeasonClient = useClientSideFlag(isHalloweenSeason);

  const borderColorClass = menuEntryBorderMap[theme];
  const barColorClass = barColorMap[theme];
  const routerPathname = useRouter().pathname;

  const settingsArray = useMemo(() => {
    let initialSettings = [
      "disableComments",
      "disableGestures",
      "disableBackgroundBlur",
      "disableSoundEffect",
    ];

    if (routerPathname.startsWith("/blog")) {
      initialSettings = [
        "disableCenterPainting",
        "disableSerifFont",
        ...initialSettings,
      ];
    }

    if (
      routerPathname.startsWith("/photos") ||
      routerPathname.startsWith("/projects")
    ) {
      initialSettings = [
        "preferInitialGridView",
        "disableEntryPopUp",
        ...initialSettings,
      ];
    }

    if (routerPathname.startsWith("/photos")) {
      initialSettings = ["enableGallery", ...initialSettings];
    }

    return initialSettings;
  }, [routerPathname]);

  const settingsNameMap: { [key in keyof Partial<SettingsState>]: string } = {
    syncSettings: "Sync Settings",
    backgroundRichness: "Background Richness",
    navigationBar: "Navigation Bar",
    disableCenterPainting: "Disable Center Blog Art",
    disableComments: "Disable Comments",
    disableGestures: "Disable Gestures",
    disableSerifFont: "Disable Serif Font",
    disableEntryPopUp: "Disable Entry Pop-Up",
    disableBackgroundBlur: "Disable Background Blur",
    enableGallery: "Gallery Mode",
    preferredManagementTheme: "Preferred Theme",
    enableHalloweenEffect: "Spooky Halloween",
    disableSoundEffect: "Disable Sound Effect",
    preferInitialGridView: "Default to Grid View",
  };

  return (
    <div className="h-full w-full overflow-y-auto px-6 md:px-8 py-8">
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
        className={`rounded-2xl w-full ${barColorClass} shadow-lg px-6 py-0 my-6 text-lg md:text-xl ${borderColorClass} border-menu-entry border-opacity-20`}
      >
        {["home", "photos", "blog", "projects", "about", "management"].map(
          (item) => (
            <MenuNavigationEntry
              key={item}
              item={
                item as
                  | "home"
                  | "photos"
                  | "blog"
                  | "projects"
                  | "about"
                  | "management"
              }
              theme={theme}
            />
          )
        )}
      </div>

      <div
        className={`rounded-2xl w-full ${barColorClass} shadow-lg px-6 py-0 my-6 ${borderColorClass} border-menu-entry border-opacity-20`}
      >
        {isHalloweenSeasonClient && (
          <>
            <div className="flex items-center my-4 ">
              <div className="flex-grow text-xl md:text-2xl font-halloween">
                {settingsNameMap["enableHalloweenEffect"]}
              </div>
              <SettingsFlip
                onClick={(status: boolean) => {
                  updateSettings({
                    enableHalloweenEffect: status,
                  });
                }}
                theme={theme}
                state={settings.enableHalloweenEffect}
                appearance="halloween"
              />
            </div>
            <div
              className={`my-0 ${borderColorClass} border-menu-rule border-opacity-20`}
            />
          </>
        )}
        <div className="flex items-center my-4 ">
          <div className="flex-grow text-lg md:text-xl">
            {settingsNameMap["syncSettings"]}
          </div>
          <SettingsFlip
            onClick={(status: boolean) => {
              updateSettings({
                syncSettings: status,
              });
            }}
            theme={theme}
            state={settings.syncSettings}
          />
        </div>
        <div
          className={`my-0 ${borderColorClass} border-menu-rule border-opacity-20`}
        />
        {routerPathname.startsWith("/management") && (
          <>
            <div className="md:flex md:items-center my-4 ">
              <div className="md:flex-grow text-lg md:text-xl min-w-background-richness">
                Theme Palette
              </div>
              <SettingsNotchBar
                setValue={(newValue: string | number) => {
                  updateSettings({
                    preferredManagementTheme: newValue as "zimo" | "about",
                  });
                }}
                values={["zimo", "about"]}
                text={["Grayscale", "Colorful"]}
                theme={theme}
                entry={settings.preferredManagementTheme}
              />
            </div>
            <div
              className={`my-0 ${borderColorClass} border-menu-rule border-opacity-20`}
            />
          </>
        )}
        <div className="md:flex md:items-center my-4 ">
          <div className="md:flex-grow text-lg md:text-xl min-w-background-richness">
            Background Richness
          </div>
          <SettingsNotchBar
            setValue={(newValue: string | number) => {
              updateSettings({
                backgroundRichness: newValue as "minimal" | "reduced" | "rich",
              });
            }}
            values={["minimal", "reduced", "rich"]}
            text={["Minimal", "Reduced", "Rich"]}
            theme={theme}
            entry={settings.backgroundRichness}
          />
        </div>
        <div
          className={`my-0 ${borderColorClass} border-menu-rule border-opacity-20`}
        />
        <div className="md:flex md:items-center my-4 ">
          <div className="md:flex-grow text-lg md:text-xl min-w-background-richness">
            Navigation Bar
          </div>
          <SettingsNotchBar
            setValue={(newValue: string | number) => {
              updateSettings({
                navigationBar: newValue as "disabled" | "always" | "flexible",
              });
            }}
            values={["disabled", "always", "flexible"]}
            text={["Disabled", "Always-On", "Flexible"]}
            theme={theme}
            entry={settings.navigationBar}
          />
        </div>
        <div
          className={`my-0 ${borderColorClass} border-menu-rule border-opacity-20`}
        />
        {routerPathname.startsWith("/projects") && (
          <>
            <div className="md:flex md:items-center my-4 ">
              <div
                className={`md:flex-grow text-lg md:text-xl min-w-background-richness ${
                  settings.floatingCodeSpeed < 1000
                    ? "flex md:block items-center"
                    : ""
                }`}
              >
                Floating Code Rate
                {settings.floatingCodeSpeed < 1000 && (
                  <div className="text-xs ml-1 md:ml-0">
                    (Performance warning)
                  </div>
                )}
              </div>
              <SettingsNotchBar
                setValue={(newValue: number | string) => {
                  updateSettings({
                    floatingCodeSpeed: newValue as number,
                  });
                }}
                values={[6000, 2800, 1800, 800, 40]}
                text={["*yawn*", "Slack", "Normal", "Hustle", "*yeet*"]}
                theme={theme}
                entry={settings.floatingCodeSpeed}
              />
            </div>
            <div
              className={`my-0 ${borderColorClass} border-menu-rule border-opacity-20`}
            />
          </>
        )}
        {settingsArray.map((item, index, array) => (
          <React.Fragment key={item}>
            <div className="flex items-center my-4 ">
              <div className="flex-grow text-lg md:text-xl">
                {settingsNameMap[item as keyof SettingsState]}
              </div>
              <SettingsFlip
                key={item}
                onClick={
                  item === "disableComments" && securityCommentShutDown
                    ? (status: boolean) => {}
                    : (status: boolean) => {
                        updateSettings({
                          [item]: status,
                        } as Partial<SettingsState>);
                      }
                }
                theme={theme}
                state={
                  item === "disableComments" && securityCommentShutDown
                    ? true
                    : ((settings as unknown as Record<string, unknown>)[
                        item
                      ] as boolean)
                }
              />
            </div>
            {index !== array.length - 1 && (
              <div
                className={`my-0 ${borderColorClass} border-menu-rule border-opacity-20`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div
        className={`rounded-2xl w-full ${barColorClass} shadow-lg px-6 py-0 mt-14 mb-4 text-lg font-bold md:text-xl ${borderColorClass} border-menu-entry border-opacity-20`}
      >
        {[
          "resetSettings",
          "clearCachedUserData",
          ...(user !== null ? ["logOut", "deleteAccount"] : []),
        ].map((item, index) => (
          <React.Fragment key={item}>
            {index !== 0 && (
              <div
                className={`my-0 ${borderColorClass} border-menu-rule border-opacity-20`}
              />
            )}
            <SettingsUtilityButton
              utility={
                item as
                  | "logOut"
                  | "resetSettings"
                  | "deleteAccount"
                  | "clearCachedUserData"
              }
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MenuContent;
