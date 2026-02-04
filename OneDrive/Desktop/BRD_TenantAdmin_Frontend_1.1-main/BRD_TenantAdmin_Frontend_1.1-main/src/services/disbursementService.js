import axiosInstance from "../utils/axiosInstance";

export const disbursementAPI = {
  // GET /api/v1/disbursement/disbursement-queue/
  getQueue: async () => {
    const res = await axiosInstance.get(
      "disbursement/disbursement-queue/"
    );
    return res.data;
  },

  // POST /api/v1/disbursement/disburse-loan/<application_id>/
  disburse: async (applicationId) => {
    const res = await axiosInstance.post(
      `disbursement/disburse-loan/${applicationId}/`
    );
    return res.data;
  },
};
