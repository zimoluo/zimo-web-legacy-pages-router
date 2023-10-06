type UserData = AccountPayloadData & {
  state: UserState;
  websiteSettings: SettingsState | null;
};

type UserInfo = AccountPayloadData & {
  name: string;
  profilePic: string;
  state: UserState;
};
