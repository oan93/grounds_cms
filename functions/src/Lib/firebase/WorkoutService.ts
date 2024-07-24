import _isEmpty from "lodash/isEmpty";
import { ApiResponse, WorkoutData } from "../Utils/types";
import { db } from "./getFirebase";

class WorkoutService {
  async getWorkoutbyName(name: string): Promise<ApiResponse<WorkoutData>> {
    try {
      const snapShotRef = db.collection("workouts");

      const querySnapshot = await snapShotRef
        .where("programName", "==", name)
        .get();

      const workout: unknown[] = [];

      if (querySnapshot.docs.length === 0) {
        return {
          success: false,
          error: { message: "doc does not exist" },
          data: null,
        };
      }

      querySnapshot.forEach((doc) => {
        workout.push({ ...doc.data(), docId: doc.id });
      });

      return {
        success: true,
        error: null,
        data: { ...(workout[0] as WorkoutData), objectType: "workout" },
      };
    } catch (error) {
      console.log("Error getting documents: ", error);
      return { success: false, error, data: null };
    }
  }
  async updateWorkout(
    workoutData: Partial<WorkoutData>
  ): Promise<ApiResponse<Partial<WorkoutData>>> {
    if (_isEmpty(workoutData) || !workoutData.docID) {
      return {
        success: false,
        data: null,
        error: {
          message: "Data field is required",
        },
      };
    }

    const { docID, ...data } = workoutData;

    try {
      const docRef = db.collection("workouts").doc(docID);
      const querySnapshot = await docRef.get();

      if (!querySnapshot.exists) {
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
        data: { ...data, objectType: "workout" },
        error: null,
      };
    } catch (error) {
      console.log("this is the error", error);
      return {
        success: false,
        data: null,
        error: {
          message: "An error occurred while updating the exercise data",
          error,
        },
      };
    }
  }
}
const workoutService = new WorkoutService();

export default workoutService;
