import axiosInstance from "../utils/axiosInstance";

const PARTNERS_URL = "/partners/";

/**
 * Get list of all third-party partners
 * @param {Object} params - query params (search, pagination, filters, etc.)
 */
export const getPartners = async (params = {}) => {
  const response = await axiosInstachnce.get(PARTNERS_URL, { params });
  return response.data;
};

/**
 * Create a new third-party partner
 * @param {Object} data - partner payload
 */
export const createPartner = async (data) => {
  const response = await axiosInstance.post(
    `${PARTNERS_URL}create/`,
    data
  );
  return response.data;
};

/**
 * Update an existing third-party partner
 * @param {string} id - UUID of partner
 * @param {Object} data - updated payload
 */
export const updatePartner = async (id, data) => {
  const response = await axiosInstance.put(
    `${PARTNERS_URL}${id}/`,
    data
  );
  return response.data;
};

/**
 * Delete a third-party partner
 * @param {string} id - UUID of partner
 */
export const deletePartner = async (id) => {
  const response = await axiosInstance.delete(
    `${PARTNERS_URL}${id}/delete/`
  );
  return response.data;
};
