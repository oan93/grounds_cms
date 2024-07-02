import { Timestamp } from "firebase-admin/firestore";
type Error = null | { message: string } | any;

type SuccessResponse<T> = {
  success: boolean;
  error: Error;
  data: T;
};

type ErrorResponse = {
  success: boolean;
  error: Error;
  data: null;
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface UserData {
  appRatingReviewed: boolean;
  appRatingSkipped: boolean;
  avatar: string;
  basalMetabolicRate: number;
  blockedList: any[]; // assuming the array contains any type of data
  createdAt: Timestamp;
  customerId: string;
  dailyMealsCount: number;
  dateOfBirth: Timestamp;
  deviceID: string;
  email: string;
  equipment: string[];
  fcmToken: string;
  finishedOnboarding: boolean;
  firstName: string;
  fitnessGoal: string;
  fitnessLevel: string;
  fromWebApp: boolean;
  goalNutrients: {
    calories: number;
    carbs: number;
    fats: number;
    formulaVersion: number;
    proteins: number;
    userCustomized: boolean;
  };
  height: number[];
  heightUnit: string;
  ignoreDualSubscriptionTill: Timestamp;
  lastName: string;
  meals: [
    {
      mealNumber: number;
      nutrients: {
        calories: number;
        carbs: number;
        fats: number;
        formulaVersion: number;
        proteins: number;
      };
      userCustomized: boolean;
      title: string;
    }
  ];
  menstruationTracking: null;
  password: string;
  selectedProgram: string;
  settings: {
    messagingToken: string;
    stepsGoal: number;
    subscriptionId: string;
  };
  totalDailyEnergyExpenditure: number;
  trainingPreferences: string[];
  updatedAt: Timestamp;
  userID: string;
  userPermissions: {
    SecTimer: boolean;
    allowCommunityNotifications: boolean;
    allowWeighInNotifications: boolean;
    allowWorkoutNotifications: boolean;
    pauseWorkoutOnExit: boolean;
    workoutSound: boolean;
    waterGoal: number;
    waterGoalUnit: string;
  };
  weighInTimes: (Timestamp | null)[];
  weight: number;
  weightUnit: string;
  objectType: string;
}

export interface Equipments {
  index: number;
  newValue: string;
}
