import { Request, Response } from "express";
import { UserData } from "../Lib/Utils/types";
import userService from "../Lib/firebase/UserService";

const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.body.email;
  const response = await userService.getUserByEmail(email);
  res.json(response);
};

const updateUserData = async (req: Request, res: Response) => {
  const data: UserData = req.body;

  const response = await userService.updateUser(data);
  res.json(response);
};

const duplicateMealPlan = async (req: Request, res: Response) => {
  const data: UserData = req.body;

  const response = await userService.duplicateMealPlan(data);
  res.json(response);
};

export { duplicateMealPlan, getUserByEmail, updateUserData };
