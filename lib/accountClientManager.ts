export async function evaluateGoogleIdToken(
  idToken: string,
  localSettingsData: SettingsState
): Promise<UserData | null> {
  try {
    // Send POST request to the API endpoint with idToken in the request body
    const response = await fetch("/api/loginUserOAuth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken, localSettingsData }),
    });

    // If the response status is not ok, throw an error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "An unknown error occurred");
    }

    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle error: display it or log it
    console.error(error);
    return null;
  }
}

export async function fetchUserDataBySub(sub: string, fields: string[]) {
  try {
    const response = await fetch("/api/getUserDataBySub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sub, fields }),
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

export async function fetchUserNameBySub(sub: string) {
  try {
    const response = await fetch("/api/getUserDataBySub", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sub, fields: ["name"] }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data.name;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return "";
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

export async function deleteUserAccount(
  sub: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/deleteUserAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sub,
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

export async function fetchComments(filePath: string): Promise<CommentEntry[]> {
  try {
    const response = await fetch("/api/getComments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Fetch failed: ${error}`);
      return []; // Return an empty array if the response is not OK
    }

    const { comments } = await response.json();
    return comments || []; // Return the comments or an empty array if comments are undefined
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return []; // Return an empty array if any error occurs
  }
}

export async function addComment(filePath: string, newComment: CommentEntry) {
  try {
    const response = await fetch("/api/addComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, newComment }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success, updatedComments } = await response.json();
    return updatedComments;
  } catch (error: any) {
    console.error(
      `An error occurred while trying to add comment: ${error.message}`
    );
    return null;
  }
}

export async function addReply(
  filePath: string,
  newReply: ReplyProps,
  commentIndex: number
) {
  try {
    const response = await fetch("/api/addReply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, newReply, commentIndex }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success, updatedComments } = await response.json();
    return updatedComments;
  } catch (error: any) {
    console.error(
      `An error occurred while trying to add reply: ${error.message}`
    );
    return null;
  }
}

export async function likeComment(filePath: string, index: number) {
  try {
    const response = await fetch("/api/likeComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, index }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success, updatedComments } = await response.json();
    return updatedComments;
  } catch (error: any) {
    console.error(
      `An error occurred while trying to like comment: ${error.message}`
    );
    return null;
  }
}

export async function deleteComment(
  filePath: string,
  index: number,
  existingComment: CommentEntry
) {
  try {
    const response = await fetch("/api/deleteComment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath, index, existingComment }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success, updatedComments } = await response.json();
    return updatedComments;
  } catch (error: any) {
    console.error(
      `An error occurred while trying to delete comment: ${error.message}`
    );
    return null;
  }
}

export async function deleteReply(
  filePath: string,
  commentIndex: number,
  replyIndex: number,
  existingReply: ReplyProps
) {
  try {
    const response = await fetch("/api/deleteReply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filePath,
        commentIndex,
        replyIndex,
        existingReply,
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success, updatedComments } = await response.json();
    return updatedComments;
  } catch (error: any) {
    console.error(
      `An error occurred while trying to delete reply: ${error.message}`
    );
    return null;
  }
}

export async function banOrUnbanUser(sub: string) {
  try {
    const response = await fetch("/api/banOrUnbanUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sub }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const { success } = await response.json();
    return success;
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return null;
  }
}

export async function fetchGeneralLike(filePath: string): Promise<string[]> {
  try {
    const response = await fetch("/api/getGeneralLike", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Fetch failed: ${error}`);
      return []; // Return an empty array if the response is not OK
    }

    const { likedBy } = await response.json();
    return likedBy || []; // Return the likedBy or an empty array if likedBy is undefined
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return []; // Return an empty array if any error occurs
  }
}

export async function updateLikedBy(filePath: string) {
  try {
    const response = await fetch("/api/updateLikedBy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(`Upload failed: ${error}`);
    }

    const updatedLikedBy = await response.json();
    return updatedLikedBy;
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return null;
  }
}

export async function fetchUploadSettingsToServer(
  sub: string,
  settings: SettingsState | null
) {
  try {
    const response = await fetch("/api/uploadSettingsToServer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ settings, sub }),
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

export async function restoreClientUser(localSettings: SettingsState): Promise<{
  integratedUser: UserData;
  downloadedSettings: SettingsState | null;
  exists: boolean;
} | null> {
  try {
    // Send POST request to the API endpoint with idToken in the request body
    const response = await fetch("/api/restoreClientUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ localSettings }),
    });

    // If the response status is not ok, throw an error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "An unknown error occurred");
    }

    // Parse and return the JSON response
    const data = await response.json();

    if (!data.exists) {
      console.log("No user session found.");
      return { exists: false } as any;
    }

    console.log("Successfully restored user session.");
    return data;
  } catch (error) {
    // Handle error: display it or log it
    console.error(error);
    return null;
  }
}
