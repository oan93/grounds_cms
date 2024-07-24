import axios from "axios";
import { REVCAT_KEY } from "../Constants/constants";

interface RevenueCatPayload {
  app_user_id: string;
  fetch_token: string;
}

const sendToRevenueCat = async (data: RevenueCatPayload) => {
  const url = "https://api.revenuecat.com/v1/receipts";
  const headers = {
    headers: {
      Authorization: `Bearer ${REVCAT_KEY}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(url, data, headers);

    console.log("revenue Cat success response", res);
    return { success: true, error: null, revCatres: res?.data };
  } catch (err) {
    console.log("revenue Cat axios error", err);
    return { success: false, error: { message: "This is the error", err } };
  }
};

export default sendToRevenueCat;
