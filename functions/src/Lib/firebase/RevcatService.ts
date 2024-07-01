import axios from "axios";

class RevcatService {
  async updateEmail(oldEmail: string, newEmail: string) {
    const url = `https://api.revenuecat.com/v1/subscribers/${oldEmail}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: ``,
    };

    const attributes = {
      attributes: {
        email: {
          value: newEmail,
        },
      },
    };
    try {
      const response = await axios.patch(url, { attributes }, { headers });

      console.log("response.data", response.data);
      return {
        success: true,
        data: response.data,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          message: "This is the error: ",
          error,
        },
      };
    }
  }
}

const revcatservice = new RevcatService();

export default revcatservice;
