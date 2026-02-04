import axiosInstance from "../utils/axiosInstance";

export const loanAccountAPI = {
    
    getAllAccounts: () => axiosInstance.get('loans/accounts/'),

    getAccountById: (id) => axiosInstance.get(`loans/accounts/${id}/`),

    getSchedule: (id) => axiosInstance.get(`loans/accounts/${id}/schedule/`),

    getTransactions: (id) => axiosInstance.get(`loans/accounts/${id}/transactions/`),

    downloadStatement: (id) => axiosInstance.get(`loans/accounts/${id}/statement/`, { responseType: 'blob' }),

    forecloseAccount: (id, data) => axiosInstance.post(`loans/accounts/${id}/foreclose/`, data)
};