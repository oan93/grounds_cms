import { Request, Response } from "express";
import { UserData } from "../Lib/Utils/types";
import userService from "../Lib/firebase/UserService";

const updateEmail = async (req: Request, res: Response) => {
  const { oldEmail, newEmail } = req.body;

  const response = userService.updateAuthUserEmail(oldEmail, newEmail);

  res.json(response);
};

const updatePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, email } = req.body;

  const response = userService.updateAuthPassword(
    oldPassword,
    newPassword,
    email
  );

  res.json(response);
};

const getUserFromFirestore = async (req: Request, res: Response) => {
  const email = req.body.email;
  const response = await userService.getUserFromFirestore(email);
  res.json(response);
};

const updateUserData = async (req: Request, res: Response) => {
  const data: UserData = req.body;

  const response = await userService.updateUser(data);
  res.json(response);
};

export { getUserFromFirestore, updateEmail, updatePassword, updateUserData };
