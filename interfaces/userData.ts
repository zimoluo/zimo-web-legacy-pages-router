type UserData = AccountPayloadData & {
    status: UserState;
    websiteSettings: SettingsState | null;
  };
  