import _isEmpty from "lodash/isEmpty";
import { ApiResponse, ExerciseData } from "../Utils/types";
import { db } from "./getFirebase";

class ExerciseService {
  async getExercisebyName(email: string): Promise<ApiResponse<ExerciseData>> {
    try {
      const snapShotRef = db
        .collection("workouts")
        .doc("exercises")
        .collection("list");
      const querySnapshot = await snapShotRef.where("email", "==", email).get();

      const exercise: unknown[] = [];

      if (querySnapshot.docs.length === 0) {
        return {
          success: false,
          error: { message: "doc does not exist" },
          data: null,
        };
      }

      querySnapshot.forEach((doc) => {
        exercise.push({ ...doc.data(), docId: doc.id });
      });

      return {
        success: true,
        error: null,
        data: { ...(exercise[0] as ExerciseData), objectType: "exercise" },
      };
    } catch (error) {
      console.log("Error getting documents: ", error);
      return { success: false, error, data: null };
    }
  }
  async updateExercise(
    exerciseData: Partial<ExerciseData>
  ): Promise<ApiResponse<Partial<ExerciseData>>> {
    if (_isEmpty(exerciseData) || !exerciseData?.exerciseID) {
      return {
        success: false,
        data: null,
        error: {
          message: "Data field is required",
        },
      };
    }

    const { exerciseID, ...data } = exerciseData;

    try {
      const docRef = db
        .collection("workouts")
        .doc("exercises")
        .collection("list")
        .doc(exerciseID);
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
        data: { ...data, objectType: "exercise" },
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
const exerciseService = new ExerciseService();

export default exerciseService;
