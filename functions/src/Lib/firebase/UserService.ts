import _isEmpty from "lodash/isEmpty";
import { ApiResponse, UserData } from "../Utils/types";
import { db } from "./getFirebase";

class UserService {
  async getUserByEmail(email: string): Promise<ApiResponse<UserData>> {
    try {
      const snapShotRef = db.collection("users");
      const querySnapshot = await snapShotRef.where("email", "==", email).get();

      const user: unknown[] = [];

      if (querySnapshot.docs.length === 0) {
        return {
          success: false,
          error: { message: "doc does not exist" },
          data: null,
        };
      }

      querySnapshot.forEach((doc) => {
        user.push({ ...doc.data(), docId: doc.id });
      });

      return {
        success: true,
        error: null,
        data: { ...(user[0] as UserData), objectType: "user" },
      };
    } catch (error) {
      console.log("Error getting documents: ", error);
      return { success: false, error, data: null };
    }
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
