import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// Reuse dashboard service pattern
import { dashboardApi } from "../../services/dashboardService";

export default function SupportTeamDashboardView() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    openTickets: 0,
    avgResponseTime: 0,
    slaCompliance: 0,
    escalatedIssues: 0,
    ticketCategories: {},
    recentTickets: [],
    priorityTickets: [],
  });

  useEffect(() => {
    fetchSupportStats();
  }, []);

  const fetchSupportStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.fetchSupportStats?.();
      if (res && res.data) setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch support stats", err);
      // keep defaults
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Escalated":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Support Team Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Handle borrower issues, track tickets, and manage escalations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/support/tickets")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            View All Tickets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">
              Open Tickets
            </span>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
          <div className="text-2xl font-black text-gray-800">
            {stats.openTickets}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">
              Avg Response Time
            </span>
            <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
              Hours
            </span>
          </div>
          <div className="text-2xl font-black text-gray-800">
            {stats.avgResponseTime}h
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">
              SLA Compliance
            </span>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">
              Target
            </span>
          </div>
          <div className="text-2xl font-black text-gray-800">
            {stats.slaCompliance}%
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase">
              Escalated Issues
            </span>
            <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">
              Critical
            </span>
          </div>
          <div className="text-2xl font-black text-gray-800">
            {stats.escalatedIssues}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-700">Recent Tickets</h3>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              Priority Queue
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentTickets && stats.recentTickets.length > 0 ? (
              stats.recentTickets.map((ticket, i) => (
                <div
                  key={ticket.id || i}
                  className="p-4 hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
                      {(ticket.customer || "C").charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {ticket.subject || "No Subject"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {ticket.customer || "Unknown Customer"} • Ticket #
                        {ticket.id || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded border font-medium ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority || "Medium"}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded border font-medium ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status || "Open"}
                    </span>
                    <button
                      onClick={() =>
                        navigate(`/support/tickets/${ticket.id || ""}`)
                      }
                      className="text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-3 py-1.5 rounded transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No tickets found.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-4">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-gray-700">Ticket Categories</h3>
          </div>

          <div className="space-y-4 flex-1">
            {stats.ticketCategories &&
            Object.keys(stats.ticketCategories).length > 0 ? (
              Object.entries(stats.ticketCategories).map(
                ([category, count]) => (
                  <div
                    key={category}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-600">{category}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {count}
                    </span>
                  </div>
                )
              )
            ) : (
              <div className="text-center text-gray-400 text-sm py-4">
                No category data available.
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                Response Quality
              </h4>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Customer Satisfaction</span>
                <span className="font-bold text-gray-900">4.2/5.0</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: "84%" }}
                ></div>
              </div>
            </div>

            <button
              onClick={() => navigate("/support/analytics")}
              className="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
