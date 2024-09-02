// import { format } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";
import { Timestamp } from "firebase-admin/firestore";
import _isEmpty from "lodash/isEmpty";
import { ApiResponse, MealPlan, UserData } from "../Utils/types";
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

  async updateProfile(
    userData: Partial<UserData>
  ): Promise<ApiResponse<Partial<UserData>>> {
    if (!userData.imageURL || !userData.userID) {
      return {
        success: false,
        data: null,
        error: {
          message: "Data field is required",
        },
      };
    }

    const { userID, imageURL } = userData;

    try {
      const docRef = db
        .collection("users")
        .doc(userID)
        .collection("references")
        .doc("postID's");
      const doc = await docRef.get();

      if (!doc.exists || !doc.data()) {
        return {
          success: false,
          data: null,
          error: {
            message: "The document does not exist",
          },
        };
      }
      const referenceList = doc.data()?.postID ?? [];
      const batch = db.batch();

      for (const id of referenceList) {
        const postRef = db.collection("community").doc(id);
        batch.update(postRef, {
          postImage: imageURL,
        });

        const commentSnapshot = await postRef.collection("comments").get();

        if (commentSnapshot.empty) {
          return {
            success: false,
            data: null,
            error: {
              message: "Comment collection is empty",
            },
          };
        }

        commentSnapshot.forEach((commentDoc) => {
          const commentData = commentDoc.data();
          if (!commentDoc.exists || !commentDoc.data()) {
            return {
              success: false,
              data: null,
              error: {
                message: "Document does not exist",
              },
            };
          }

          const comments: any[] = commentData.comments ?? [];
          const replies: any[] = commentData.replies ?? [];
          const updatedComments = comments.map((comment) => {
            if (comment.commentID == id) {
              comment.commentImage = imageURL;
            }

            return comment;
          });

          const updatedReplies = replies.map((reply) => {
            if (reply.replyID == id) {
              reply.replyImage = imageURL;
            }

            return reply;
          });

          return batch.update(commentDoc.ref, {
            comments: updatedComments,
            replies: updatedReplies,
          });
        });
      }

      const result = await batch.commit();

      return {
        success: true,
        data: { ...result, objectType: "user" },
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

  async duplicateMeal({
    mealPlan,
    selectedMealTimeList,
    providedMealTime,
    userID,
  }: {
    mealPlan: MealPlan;
    selectedMealTimeList: string[]; // Accepting list of meal times
    providedMealTime: string;
    userID: string;
  }): Promise<ApiResponse<Partial<MealPlan>>> {
    const selectedMealDate = new Date(providedMealTime);
    const selectedMealTimeTimestamp = Timestamp.fromDate(selectedMealDate);

    try {
      for (const selectedMeal of selectedMealTimeList) {
        const reference = db
          .collection("users")
          .doc(userID)
          .collection("mealPlans")
          .doc(selectedMeal);

        const doc = await reference.get();

        if (!doc.exists) {
          // If the document doesn't exist, create a new meal plan
          const newMealPlan: MealPlan = {
            dailyMeals: [mealPlan.dailyMeals[mealPlan.dailyMeals.length - 1]],
            meals: [mealPlan.meals[mealPlan.meals.length - 1]],
            nutrients: mealPlan.nutrients,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          };

          try {
            await reference.set({
              ...newMealPlan,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            });
          } catch (e) {
            console.error("Error creating new meal plan:", e);
            return {
              success: false,
              data: null,
              error: {
                message: "Error creating new meal plan",
              },
            };
          }

          // Skip to the next iteration after successfully creating a new meal plan
          continue;
        }

        const existingPlan = doc.data() as MealPlan;
        const timeZone = "UTC";

        const index = existingPlan.meals.findIndex((meal) => {
          const mealDate = new Date(meal.mealTime.seconds * 1000);

          const zonedMealDate = toZonedTime(mealDate, timeZone);
          const zonedSelectedDate = toZonedTime(selectedMealDate, timeZone);

          return (
            zonedMealDate.getHours() === zonedSelectedDate.getHours() &&
            zonedMealDate.getMinutes() === zonedSelectedDate.getMinutes() &&
            format(zonedMealDate, "a", { timeZone }).toUpperCase() ===
              format(zonedSelectedDate, "a", { timeZone }).toUpperCase()
          );
        });

        const newUserMeal = mealPlan.meals[mealPlan.meals.length - 1];
        const newDailyMeal =
          mealPlan.dailyMeals[mealPlan.dailyMeals.length - 1];

        newUserMeal.mealTime = selectedMealTimeTimestamp;
        newDailyMeal.mealTime = selectedMealTimeTimestamp;
        newUserMeal.createdAt = selectedMealTimeTimestamp;

        if (index !== -1) {
          try {
            existingPlan.meals[index].products.push(
              ...mealPlan.meals[index].products
            );
          } catch (e) {
            console.error("Error updating existing meal products:", e);
            return {
              success: false,
              data: null,
              error: {
                message: "Error updating existing meal products",
              },
            };
          }
        } else {
          existingPlan.meals.push(newUserMeal);
          existingPlan.dailyMeals.push(newDailyMeal);
        }

        try {
          await reference.update({
            ...existingPlan,
            updatedAt: Timestamp.now(),
          });
        } catch (e) {
          console.error("Error updating meal plan:", e);
          return {
            success: false,
            data: null,
            error: {
              message: "Error updating meal plan",
            },
          };
        }
      }

      return {
        success: true,
        data: {
          updatedAt: Timestamp.now(),
        },
        error: null,
      };
    } catch (e) {
      console.error("Error processing meal duplication:", e);
      return {
        success: false,
        data: null,
        error: {
          message: "An exception occurred during meal duplication",
        },
      };
    }
  }
}

const userService = new UserService();
export default userService;
