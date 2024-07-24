import { Request, Response } from "express";
import { WorkoutData } from "../Lib/Utils/types";
import workoutService from "../Lib/firebase/WorkoutService";

const getWorkoutData = async (req: Request, res: Response) => {
  const name = req.body.name;
  const response = await workoutService.getWorkoutbyName(name);
  res.json(response);
};

const updateWorkoutData = async (req: Request, res: Response) => {
  const data: WorkoutData = req.body;
  const response = await workoutService.updateWorkout(data);
  res.json(response);
};

// const updateWeeklyData = async (req: Request, res: Response) => {
//   const data: WeeklyData = req.body;
//   const response = await workoutService.updateWeeklyData(data);
//   res.json(response);
// };

export { getWorkoutData, updateWorkoutData };
