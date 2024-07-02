import _get from "lodash/get";
import sendToRevenueCat from "../Utils/RevcatService";
import { admin, db } from "./getFirebase";

class UserService {
  async updateAuthUserEmail(
    oldEmail: string,
    newEmail: string,
    getUserRes: any
  ) {
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
      const user = getUserRes;

      if (!user) {
        return {
          success: false,
          data: null,
          error: {
            message: "Could not find user",
          },
        };
      }

      const uid = user.userID;

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

      const { customerId = "", subscriptionId = "" } = _get(user, "data", {});

      if (!customerId || !subscriptionId) {
        return {
          success: false,
          error: {
            message: "Customer Id or Subscription Id does not exists",
          },
          user,
        };
      }

      // const customer = await stripe.customers.update(customerId, {
      //   email: emailToAdd,
      //   metadata: {
      //     email: emailToAdd,
      //     oldEmail: emailToDelete,
      //     updatedEmail: true,
      //   },
      // });

      const revenueCatRes = await sendToRevenueCat({
        app_user_id: newEmail,
        fetch_token: subscriptionId,
      });

      return {
        success: true,
        error: null,
        data: {
          updateEmailFromFirestore,
          ...revenueCatRes,
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

  async getUserByEmail(email: string) {
    const snapShotRef = db.collection("users");
    const user = await snapShotRef
      .where("email", "==", email)
      .get()
      .then((querySnapshot) => {
        const user: unknown[] = [];

        if (querySnapshot.docs.length === 0) {
          return {
            success: false,
            error: { message: "doc does not exist" },
            user: null,
          };
        }
        querySnapshot.forEach((doc) => {
          user.push({ ...doc.data(), docId: doc.id });
        });

        return {
          success: true,
          error: null,
          data: { ..._get(user, "[0]", {}), objectType: "user" },
        };
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
        return { success: false, error: error, data: null };
      });

    return user;
  }
}
const adminService = new UserService();

export default adminService;
