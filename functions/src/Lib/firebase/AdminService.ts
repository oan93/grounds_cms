const _get = require("lodash/get");
import { STRIPE_SECRET_KEY } from "../Constants/constants";
import sendToRevenueCat from "../Utils/RevcatService";
import { ApiResponse, UserData } from "../Utils/types";
import { admin, db } from "./getFirebase";

const stripe = require("stripe")(STRIPE_SECRET_KEY);

class UserService {
  async updateAuthUserEmail(
    oldEmail: string,
    newEmail: string,
    user: UserData
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
      const { userID: uid = "", subscriptionId = "", customerId = "" } = user;

      if (!uid) {
        return {
          success: false,
          data: null,
          error: {
            message: "Uid field is required",
          },
        };
      }

      const updateEmailPromise = admin.auth().updateUser(uid, {
        email: newEmail,
      });

      const updateFirestorePromise = admin
        .firestore()
        .collection("users")
        .doc(uid)
        .update({
          email: newEmail,
        });

      if (!customerId || !subscriptionId) {
        return {
          success: false,
          error: {
            message: "Customer Id or Subscription Id does not exist",
          },
          user,
        };
      }

      const updateEmailfromStripe = stripe.customers.update(customerId, {
        email: newEmail,
        metadata: {
          email: newEmail,
          oldEmail: oldEmail,
          updatedEmail: true,
        },
      });

      const revenueCatPromise = sendToRevenueCat({
        app_user_id: newEmail,
        fetch_token: subscriptionId,
      });

      return Promise.allSettled([
        updateEmailPromise,
        updateFirestorePromise,
        updateEmailfromStripe,
        revenueCatPromise,
      ]).then((results) => {
        const [
          updateEmailRes,
          updateFirestoreRes,
          updateEmailfromStripe,
          revenueCatRes,
        ] = results;

        const allSuccess = results.every(
          (result) => result.status === "fulfilled"
        );

        if (allSuccess) {
          return {
            success: true,
            error: null,
            data: {
              updateEmailFromFirestore: (
                updateFirestoreRes as PromiseFulfilledResult<any>
              ).value,
              ...(updateEmailfromStripe as PromiseFulfilledResult<any>).value,
              ...(revenueCatRes as PromiseFulfilledResult<any>).value,
              ...(updateEmailRes as PromiseFulfilledResult<any>).value,
              objectType: "users",
            },
          };
        } else {
          return {
            success: false,
            error: {
              message: "Some operations failed",
              results: results.map((result) => ({
                status: result.status,
                value: result.status === "fulfilled" ? result.value : null,
                reason: result.status === "rejected" ? result.reason : null,
              })),
            },
            data: null,
          };
        }
      });
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
    newPassword: string,
    oldPassword: string,
    email: string
  ) {
    if (!newPassword || !oldPassword || !email) {
      return {
        success: false,
        data: null,
        error: {
          message: "Password and email fields are required",
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

      const uid = user?.uid;

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

  async getUserByEmail(email: string): Promise<ApiResponse<UserData>> {
    const snapShotRef = db.collection("users");
    await snapShotRef
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
    return {
      success: false,
      data: null,
      error: {
        message: "Something went wrong",
      },
    };
  }

  async deleteUser(userID: string) {
    console.log(userID);

    try {
      const res = await admin.auth().deleteUser(userID);
      console.log("user auth Deleted ");

      return { success: true, error: null, authDeleteResponse: res };
    } catch (err) {
      console.log("user auth delete error", err);
      return { success: false, error: err, authDeleteRes: null };
    }
  }
}
const adminService = new UserService();

export default adminService;
