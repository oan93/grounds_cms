import { Request, Response } from "express";
import adminService from "../Lib/firebase/AdminService";

const updateEmail = async (req: Request, res: Response) => {
  const { oldEmail, newEmail } = req.body;

  const getUserRes = await adminService.getUserByEmail(oldEmail);
  const response = adminService.updateAuthUserEmail(
    oldEmail,
    newEmail,
    getUserRes
  );

  res.json(response);
};

const updatePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, email } = req.body;

  const response = adminService.updateAuthPassword(
    oldPassword,
    newPassword,
    email
  );

  res.json(response);
};

const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.body.email;
  const response = await adminService.getUserByEmail(email);
  res.json(response);
};

export { getUserByEmail, updateEmail, updatePassword };
