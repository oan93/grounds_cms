import { Request, Response } from "express";
import adminService from "../Lib/firebase/AdminService";
import { UserData } from "../Lib/Utils/types";

const updateEmail = async (req: Request, res: Response) => {
  console.log("im here");
  const { oldEmail, newEmail } = req.body;

  const getUserRes = await adminService.getUserByEmail(oldEmail);

  if (!getUserRes.success) {
    res.json({
      success: false,
      data: null,
      error: {
        message: "User Data not found",
      },
    });
  }
  const response = await adminService.updateAuthUserEmail(
    oldEmail,
    newEmail,
    getUserRes.data as UserData
  );

  res.json(response);
};

const updatePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword, email } = req.body;

  const response = await adminService.updateAuthPassword(
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

const deleteUser = async (req: Request, res: Response) => {
  const uid = req.body.userID;

  const response = await adminService.deleteUser(uid);
  res.json(response);
};

export { deleteUser, getUserByEmail, updateEmail, updatePassword };
