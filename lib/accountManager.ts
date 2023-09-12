import { defaultSettings } from "@/interfaces/defaultSettings";

export async function fetchUploadUserToServer(
  user: Omit<UserData, "secureSub">,
  secureSub: string
) {
  try {
    const response = await fetch("/api/uploadUserToServer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, secureSub }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("Error uploading user data:", error);
    return null;
  }
}

export async function fetchUploadUserToServerWithOnlyUser(user: UserData) {
  const { secureSub, ...userWithoutSub } = user;

  try {
    const response = await fetch("/api/uploadUserToServer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: userWithoutSub, secureSub }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("Error uploading user data:", error);
    return null;
  }
}

export async function fetchDecodedToken(token: string, unsafe: boolean = true) {
  const apiLocation = unsafe ? "/api/unsafeDecodeToken" : "/api/decodeToken";

  try {
    const response = await fetch(apiLocation, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("Error fetching decoded token:", error);
    return null;
  }
}

export async function fetchUserDataBySecureSub(
  secureSub: string,
  fields: string[]
) {
  try {
    const response = await fetch("/api/getUserDataBySecureSub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ secureSub, fields }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function fetchCheckIfUserExistsBySecureSub(secureSub: string) {
  try {
    const response = await fetch("/api/checkIfUserExistsBySecureSub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ secureSub }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data.exists;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return null;
  }
}

export async function getUserByPayload(payload: AccountPayloadData) {
  let profilePic = payload.profilePic;
  let userName = payload.name;
  let userState = "normal";

  const savedRawSettings = localStorage.getItem("websiteSettings");
  const loadedSettings = savedRawSettings
    ? JSON.parse(savedRawSettings)
    : defaultSettings;

  const doSyncSettings = loadedSettings.syncSettings;

  const secureSub = payload.secureSub;

  let localSettings = doSyncSettings ? loadedSettings : null;

  if (!(await fetchCheckIfUserExistsBySecureSub(secureSub))) {
    // Creating account data on server. Respects syncSettings option.
    const user = {
      profilePic: profilePic,
      name: userName,
      state: userState,
      websiteSettings: localSettings,
    } as unknown as UserData;
    await fetchUploadUserToServer(user, secureSub);
  } else {
    // Downloading data from the server. Respects syncSettings option.
    const downloadedUser = await fetchUserDataBySecureSub(secureSub, [
      "name",
      "profilePic",
      "state",
      "websiteSettings",
    ]);
    userName = downloadedUser.name;
    profilePic = downloadedUser.profilePic;
    userState = downloadedUser.state as UserState;
    localSettings = doSyncSettings ? downloadedUser.websiteSettings : null;
  }

  const fetchedUser = {
    name: userName,
    profilePic: profilePic,
    secureSub: secureSub,
    state: userState,
    websiteSettings: localSettings,
  } as UserData;

  return fetchedUser;
}

export async function setSessionToken(userData: UserData): Promise<void> {
  try {
    const response = await fetch("/api/setSessionToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      console.log("Session created successfully.");
    } else {
      const data = await response.json();
      console.error(`Failed to create session: ${data.error}`);
    }
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
}

export async function getSessionToken(): Promise<UserData | null> {
  try {
    const res = await fetch("/api/getSessionToken", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.exists) {
        console.log("Session exists.");
        return data.userData as UserData;
      } else {
        console.log("No active session.");
        return null;
      }
    } else {
      const data = await res.json();
      console.error(`Failed to check session: ${data.error}`);
      return null;
    }
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return null;
  }
}

export async function clearSessionToken() {
  try {
    const response = await fetch("/api/clearSessionToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error clearing session token:", error);
    return null;
  }
}

export async function modifySessionToken(user: UserData): Promise<void> {
  try {
    const response = await fetch("/api/modifySessionToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user), // Include the user data in the request body
    });

    const data = await response.json();

    if (response.status === 200 && data.success) {
      console.log("Successfully modified session token");
    } else {
      console.error("Failed to modify session token:", data.error);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export async function deleteUserAccount(
  secureSub: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/deleteUserAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secureSub,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: "Successfully deleted the user file." };
    } else {
      return { success: false, message: data.error };
    }
  } catch (error: any) {
    return { success: false, message: `Client-side error: ${error.message}` };
  }
}
