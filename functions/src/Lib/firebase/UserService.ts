import _isEmpty from "lodash/isEmpty";
import { ApiResponse, MealsData, UserData } from "../Utils/types";
import { db } from "./getFirebase";
import { Timestamp } from "firebase-admin/firestore";

import {
  firebaseTimestampToLocalTime,
  getFirebaseUtcTimestamp,
} from "../Utils";

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

  getFirebaseUtcTimestamp = (timestamp: number | Date) => {
    const date = new Date(timestamp);
    const firebaseTimestamp = Timestamp.fromDate(date);
    return firebaseTimestamp;
  };

  async duplicateMealPlan(
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
      const docRef = db.collection("users").doc(userID).collection("mealPlans");
      const doc = await docRef.get();

      if (doc.empty) {
        return {
          success: false,
          data: null,
          error: {
            message: "The document does not exist",
          },
        };
      }

      const fetchedDates: string[] = doc.docs.map((doc) => doc.id);
      const providedDates: string[] = data?.mealDates ?? [];
      const datesToUpdate = providedDates.filter((date) =>
        fetchedDates.includes(date)
      );

      console.log("Dates to update:", datesToUpdate);

      for (const mealDate of datesToUpdate) {
        const docSnapshot = await docRef.doc(mealDate).get();
        // const mealData = docSnapshot.data() as MealsData;
        const mealData = {
          ...docSnapshot.data(),
          docId: docSnapshot.id,
        } as MealsData;

        //! converts firebase timestamp into formatted and utc date
        const { formattedDate, utcDate } = firebaseTimestampToLocalTime(
          mealData.createdAt
        );

        //! converts utc date back to firebase timestamp
        const firebaseTimestamp = getFirebaseUtcTimestamp(utcDate);

        console.log({ formattedDate, firebaseTimestamp });

        console.log("currentDate", {
          Timestamp: Timestamp.now(),
          TimestampMillis: Timestamp.now().toMillis(),
        });

        // console.log(localDate.format('YYYY-MM-DD h:mm:ss a'));

        if (!mealData && !data.singularMeal) {
          return {
            success: false,
            data: null,
            error: {
              message: "mealData or singularMeal is empty",
            },
          };
        }

        // if (mealData && Array.isArray(mealData.meals) && data.singularMeal) {
        //   const mealProduct = data.singularMeal as Product;

        //   const existingMeal = mealData.meals.find(
        //     (meal) => meal.createdAt === mealProduct.createdAt
        //   );

        //   if (existingMeal) {
        //     if (Array.isArray(existingMeal.products)) {
        //       existingMeal.products.push(...mealProduct.products);
        //     }
        //   } else {
        //     mealData.meals.push(mealProduct);
        //   }

        //   await docRef
        //     .doc(mealDate)
        //     .set({ meals: mealData.meals }, { merge: true });
        // }
      }

      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (e) {
      return {
        success: false,
        data: null,
        error: {
          message: "An error occurred",
          e,
        },
      };
    }
  }
}

const userService = new UserService();
export default userService;
