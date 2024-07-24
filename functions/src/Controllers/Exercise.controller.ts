import { Request, Response } from "express";
import exerciseService from "../Lib/firebase/ExerciseService";

const getExerciseData = async (req: Request, res: Response) => {
  const name = req.body.name;
  const response = await exerciseService.getExercisebyName(name);
  res.json(response);
};

const updateExerciseData = async (req: Request, res: Response) => {
  const data = req.body;
  const response = await exerciseService.updateExercise(data);
  res.json(response);
};

export { getExerciseData, updateExerciseData };
