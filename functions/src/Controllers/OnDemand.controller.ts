import { Request, Response } from "express";
import { OnDemandData } from "../Lib/Utils/types";
import onDemandService from "../Lib/firebase/OnDemandService";

const getOnDemandData = async (req: Request, res: Response) => {
  const name = req.body.workoutName;
  const response = await onDemandService.getOnDemandbyName(name);
  res.json(response);
};

const updateOnDemandData = async (req: Request, res: Response) => {
  const data: OnDemandData = req.body;
  const response = await onDemandService.updateWorkout(data);
  res.json(response);
};

const updateExerciseData = async (req: Request, res: Response) => {
  const exerciseData = req.body;
  const response = await onDemandService.updateExerciseData(exerciseData);

  res.json(response);
};

export { getOnDemandData, updateOnDemandData, updateExerciseData };
