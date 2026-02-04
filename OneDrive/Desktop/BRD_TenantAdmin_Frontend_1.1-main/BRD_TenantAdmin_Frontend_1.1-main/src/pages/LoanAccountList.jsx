import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loanAccountAPI } from "../services/loanAccountService";

export default function LoanAccountsList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await loanAccountAPI.getAllAccounts(); 
        setAccounts(res.data);
      } catch (err) {
        console.error("Error loading loan list");
      } finally { setLoading(false); }
    };
    fetchAccounts();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Active Loan Accounts (LMS)</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="px-6 py-4">Loan ID</th>
              <th className="px-6 py-4">Borrower</th>
              <th className="px-6 py-4">Total Loan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accounts.map(acc => (
              <tr key={acc.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-bold">{acc.loan_no}</td>
                <td className="px-6 py-4">{acc.borrower_name}</td>
                <td className="px-6 py-4">₹{acc.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs">{acc.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  {/* THIS IS THE BRIDGE: Navigates to the ID */}
                  <button 
                    onClick={() => navigate(`/loan-accounts/${acc.id}`)}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    View Details →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}