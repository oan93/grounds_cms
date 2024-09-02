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
  const { userID, selectedMealTimeList, providedMealTime, mealPlan } = req.body;

  if (!userID || !selectedMealTimeList || !mealPlan) {
    res.json({
      success: false,
      data: null,
      error: {
        message: "Expected fields are coming out null",
      },
    });
  }

  const response = await userService.duplicateMeal({
    mealPlan,
    selectedMealTimeList,
    userID,
    providedMealTime,
  });
  res.json(response);
};

// const updateProfile = async (req: Request, res: Response) => {
//   const data: UserData = req.body;

//   const response = await userService.updateProfile(data);
//   res.json(response);
// };
export { duplicateMealPlan, getUserByEmail, updateUserData };
