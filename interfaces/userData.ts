type UserData = AccountPayloadData & {
  state: UserState;
  websiteSettings: SettingsState | null;
};
