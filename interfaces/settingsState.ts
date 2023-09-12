interface SettingsState {
  backgroundRichness: "minimal" | "reduced" | "rich";
  syncSettings: boolean;
  navigationBar: "disabled" | "always" | "flexible";
  floatingCodeSpeed: number;
  disableCenterPainting: boolean;
  disableComments: boolean;
  disableGestures: boolean;
  disableSerifFont: boolean;
}
