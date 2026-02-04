import { useState, useEffect } from "react";
import {
  BanknotesIcon,
  ArrowRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { disbursementAPI } from "../services/disbursementService";

export default function DisbursementQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        setLoading(true);
        const data = await disbursementAPI.getQueue();

        console.log("Disbursement Queue API:", data);

        // handle both array & paginated response
        if (Array.isArray(data)) {
          setQueue(data);
        } else if (Array.isArray(data?.results)) {
          setQueue(data.results);
        } else {
          setQueue([]);
        }
      } catch (error) {
        console.error("Failed to load disbursement queue:", error);
        setQueue([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, []);

  const handleDisburse = async (loan) => {
    if (
      !window.confirm(
        `Confirm transfer of ₹${loan.amount.toLocaleString()} to ${loan.name}?`
      )
    )
      return;

    setProcessingId(loan.id);

    try {
      await disbursementAPI.disburse(loan.id);

      setQueue((prev) => prev.filter((q) => q.id !== loan.id));

      alert(`💰 Funds transferred successfully to ${loan.bank}!`);
    } catch (error) {
      console.error("Disbursement failed:", error);
      alert("Disbursement failed. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading disbursement queue...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 rounded-xl text-green-700">
          <BanknotesIcon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Disbursement Queue
          </h1>
          <p className="text-sm text-gray-500">
            Release funds for signed loan applications
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500">
                Applicant
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500">
                Bank
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {queue.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  No Pending Disbursements
                </td>
              </tr>
            ) : (
              queue.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{loan.name}</div>
                    <div className="text-xs text-gray-500">
                      Application ID: {loan.id}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-bold text-green-700">
                    ₹{loan.amount.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <div>{loan.bank}</div>
                    <div className="text-xs text-gray-500">{loan.ifsc}</div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDisburse(loan)}
                      disabled={processingId === loan.id}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                      {processingId === loan.id ? (
                        <>
                          Processing
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          Disburse
                          <ArrowRightIcon className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
