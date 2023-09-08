import { useUser } from "@/components/Contexts/UserContext";
import { fetchUploadUserToServer } from "@/pages/api/uploadUserToServer";

export async function fetchDecodedToken(token: string) {
  try {
    const response = await fetch('/api/unsafeDecodeToken', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;

  } catch (error) {
    console.error('Error fetching decoded token:', error);
    return null;
  }
}

export async function fetchUserDataBySecureSub(secureSub: string, fields: string[]) {
  try {
    const response = await fetch('/api/getUserDataBySecureSub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secureSub, fields }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export async function fetchCheckIfUserExistsBySecureSub(secureSub: string) {
  try {
    const response = await fetch('/api/checkIfUserExistsBySecureSub', {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ secureSub }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data.exists;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return null;
  }
}

export async function updateUserByPayload(payload: AccountPayloadData) {
  const profilePic = payload.profilePic;
  const userName = payload.name;
  const userState = 'normal';
  const secureSub = payload.secureSub;

  if (!(await fetchCheckIfUserExistsBySecureSub(secureSub))) {
    const user = {profilePic: profilePic, name: userName, state: userState};
    await fetchUploadUserToServer(user, secureSub);
  } else {
    const downloadedUser = await fetchUserDataBySecureSub(secureSub, ['name', 'profilePic', 'state']);
    console.log('downloaded user');
    console.log(downloadedUser);
    const userName = downloadedUser.name;
    const profilePic = downloadedUser.profilePic;
    const userState = downloadedUser.state as UserState;
  }

  const { setUser } = useUser();

  setUser({name: userName, profilePic: profilePic, secureSub: secureSub, status: userState})

}

