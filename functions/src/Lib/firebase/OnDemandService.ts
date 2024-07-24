import _isEmpty from "lodash/isEmpty";
import { ApiResponse, OnDemandData } from "../Utils/types";
import { db } from "./getFirebase";

class OnDemandService {
  async getOnDemandbyName(name: string): Promise<ApiResponse<OnDemandData>> {
    try {
      const snapShotRef = db
        .collection("workouts")
        .doc("onDemandWorkouts")
        .collection("workoutData");

      const querySnapshot = await snapShotRef
        .where("workoutName", "==", name)
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
        data: { ...(workout[0] as OnDemandData), objectType: "workout" },
      };
    } catch (error) {
      console.log("Error getting documents: ", error);
      return { success: false, error, data: null };
    }
  }
  async updateWorkout(
    workoutData: Partial<OnDemandData>
  ): Promise<ApiResponse<Partial<OnDemandData>>> {
    if (_isEmpty(workoutData) || !workoutData.workoutName) {
      return {
        success: false,
        data: null,
        error: {
          message: "Data field is required",
        },
      };
    }

    const { workoutName, ...data } = workoutData;

    try {
      const docRef = db
        .collection("workouts")
        .doc("onDemandWorkouts")
        .collection("workoutData")
        .doc(workoutName);
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

  async updateExerciseData(exerciseData: any) {
    if (_isEmpty(exerciseData) || !exerciseData.workoutName) {
      return {
        success: false,
        data: null,
        error: {
          message: "Data field is required",
        },
      };
    }

    const { workoutName, ...data } = exerciseData;

    try {
      const docRef = db
        .collection("workouts")
        .doc("onDemandWorkouts")
        .collection("workoutData")
        .doc(workoutName)
        .collection("exerciseData")
        .doc("data");
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
const onDemandService = new OnDemandService();

export default onDemandService;
