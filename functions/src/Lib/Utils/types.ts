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
  mealDates: string[];
  singularMeal: {};
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
  subscriptionId: string;
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

export interface ExerciseData {
  difficulty: string;
  equipment: string;
  equipmentList: string[];
  equipmentTags: string[];
  exerciseID: string;
  focus: string;
  instructions: string[];
  instructor: string;
  lowImpact: boolean;
  name: string;
  nameTags: string[];
  secondaryFocus: string[];
  videos: Video[];
  objectType: string;
}

interface Video {
  angle: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  thumbnail: string;
  videoURL: string;
}

export interface WorkoutData {
  description: string;
  descriptions: string[];
  docID: string;
  equipment: string[];
  equipmentType: string;
  featuredProgram: boolean;
  imageUrl: string;
  instructor: string;
  intensity: number;
  isProgram: boolean;
  live: boolean;
  numberOfEquipments: number;
  numberOfParticipants: number;
  participants: string[];
  programFocus: string;
  programName: string;
  programOrderBy: number;
  programType: string;
  weeks: number;
  workoutPerWeek: number[];
  workoutTime: string;
  objectType: string;
}

export interface OnDemandData {
  calorieExp: number;
  categoryName: string;
  categoryOrderBy: number;
  equipment: string[];
  focus: string;
  imageUrl: string;
  instructor: string;
  intensity: number;
  isLive: boolean;
  newArrival: boolean;
  tags: string[];
  totalSets: number;
  workoutName: string;
  workoutOrderBy: number;
  workoutTime: string;
  workoutTimeMin: number;
  objectType: string;
}

export interface Nutrients {
  calories: number;
  carbs: number;
  fats: number;
  formulaVersion: number;
  proteins: number;
}

export interface Meal {
  mealNumber: number;
  nutrients: Nutrients;
  userCustomized: boolean;
  title: string;
}

export interface Product {
  createdAt: Timestamp; // Use Date type if necessary
  favorite: boolean;
  mealName: string;
  mealTime: Timestamp;
  products: any[]; // Define a more specific type if possible
  updatedAt: Timestamp; // Use Date type if necessary
}

export interface MealsData {
  createdAt: Timestamp; // Use Date type if necessary
  dailyMeals: Product[];
  meals: Product[];
  nutrients: Nutrients;
  userCustomized: boolean;
  updatedAt: Timestamp; // Use Date type if necessary
  docId?: string;
}
