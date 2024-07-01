import _isEmpty from "lodash/isEmpty";
import { ApiResponse, UserData } from "../Utils/types";
import { admin, db } from "./getFirebase";

class UserService {
  async updateAuthUserEmail(oldEmail: string, newEmail: string) {
    if (!oldEmail || !newEmail) {
      return {
        success: false,
        data: null,
        error: {
          message: "Email field is required",
        },
      };
    }
    try {
      const user = await admin.auth().getUserByEmail(oldEmail);

      if (!user) {
        return {
          success: false,
          data: null,
          error: {
            message: "Could not find user",
          },
        };
      }

      const uid = user.uid;

      if (!uid) {
        return {
          success: false,
          data: null,
          error: {
            message: "Uid field is required",
          },
        };
      }

      const updateEmailRes = await admin.auth().updateUser(uid, {
        email: newEmail,
      });

      const updateEmailFromFirestore = await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
          email: newEmail,
        });

      return {
        success: true,
        error: null,
        data: {
          updateEmailFromFirestore,
          ...updateEmailRes,
          objectType: "users",
        },
      };
    } catch (error) {
      console.log("got this error", error);
      return {
        success: false,
        data: null,
        error: {
          message: "This is the Error: ",
          error,
        },
      };
    }
  }

  async updateAuthPassword(
    oldPassword: string,
    newPassword: string,
    email: string
  ) {
    if (!oldPassword || !newPassword) {
      return {
        success: false,
        data: null,
        error: {
          message: "Password field is required",
        },
      };
    }
    try {
      const user = await admin.auth().getUserByEmail(email);

      if (!user) {
        return {
          success: false,
          data: null,
          error: {
            message: "Could not find user",
          },
        };
      }

      const uid = user.uid;

      if (!uid) {
        return {
          success: false,
          data: null,
          error: {
            message: "Uid field is required",
          },
        };
      }

      const updatePasswordRes = await admin.auth().updateUser(uid, {
        password: newPassword,
      });

      const updatePasswordFromFirestore = await admin
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
          password: newPassword,
        });

      return {
        success: true,
        error: null,
        data: {
          updatePasswordFromFirestore,
          ...updatePasswordRes,
          objectType: "users",
        },
      };
    } catch (error) {
      console.log("got this error", error);
      return {
        success: false,
        data: null,
        error: {
          message: "This is the Error: ",
          error,
        },
      };
    }
  }

  async getUserFromFirestore(email: string): Promise<ApiResponse<UserData>> {
    console.log(email);

    if (!email) {
      return {
        success: false,
        data: null,
        error: {
          message: "Email is required",
        },
      };
    }

    const snapShotRef = db.collection("users");
    const querySnapshot = await snapShotRef.where("email", "==", email).get();

    const user: unknown[] = [];

    if (querySnapshot.docs.length === 0) {
      return {
        success: false,
        data: null,
        error: {
          message: "document does not exist",
        },
      };
    }

    querySnapshot.forEach((doc) => user.push({ ...doc.data(), docId: doc.id }));

    return {
      success: true,
      error: null,
      data: { ...(user[0] as UserData), objectType: "user" },
    };
  }

  async updateUser(
    userData: Partial<UserData>
  ): Promise<ApiResponse<Partial<UserData>>> {
    if (_isEmpty(userData) || !userData.userID) {
      return {
        success: false,
        data: null,
        error: {
          message: "Data field is required",
        },
      };
    }

    const { userID, ...data } = userData;

    try {
      const docRef = db.collection("users").doc(userID);
      const doc = await docRef.get();

      if (!doc.exists) {
        return {
          success: false,
          data: null,
          error: {
            message: "The document does not exist",
          },
        };
      }
      await docRef.update(data);

      return {
        success: true,
        data: { ...data, objectType: "user" },
        error: null,
      };
    } catch (error) {
      console.log("this is the error", error);
      return {
        success: false,
        data: null,
        error: {
          message: "An error occurred while updating the user data",
          error,
        },
      };
    }
  }
}
const userService = new UserService();

export default userService;
