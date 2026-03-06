const BASE_URL = "http://127.0.0.1:8000/api/update-payout";

// ============================================================
//  PAYOUT DASHBOARD
// ============================================================

export const PayoutDashboardService = {

  /**
   * GET /api/update-payout/
   * Fetch all dashboard records
   */
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch payout dashboard records");
    return response.json();
  },

  /**
   * POST /api/update-payout/
   * Create a new dashboard record
   * @param {Object} data - { active_payouts, Avg_rate, max_pool, payout_modes, date }
   */
  create: async (data) => {
    const response = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create payout dashboard record");
    return response.json();
  },

  /**
   * GET /api/update-payout/<id>/
   * Fetch a single dashboard record by ID
   * @param {number} id
   */
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Failed to fetch payout dashboard record with id ${id}`);
    return response.json();
  },

  /**
   * PUT /api/update-payout/<id>/
   * Full update of a dashboard record
   * @param {number} id
   * @param {Object} data - { active_payouts, Avg_rate, max_pool, payout_modes, date }
   */
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update payout dashboard record with id ${id}`);
    return response.json();
  },

  /**
   * PATCH /api/update-payout/<id>/
   * Partial update of a dashboard record
   * @param {number} id
   * @param {Object} data - partial fields
   */
  partialUpdate: async (id, data) => {
    const response = await fetch(`${BASE_URL}/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to partially update payout dashboard record with id ${id}`);
    return response.json();
  },

  /**
   * DELETE /api/update-payout/<id>/
   * Delete a dashboard record
   * @param {number} id
   */
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Failed to delete payout dashboard record with id ${id}`);
    return { success: true, id };
  },
};

// ============================================================
//  PAYOUT SEARCH
//  Types: "dsa" | "broker" | "lead_partner"
// ============================================================

export const PayoutSearchService = {

  /**
   * GET /api/update-payout/
   * Fetch all search records
   */
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch payout search records");
    return response.json();
  },

  /**
   * POST /api/update-payout/
   * Create a new search record
   * @param {Object} data - { search, type }
   *   type: "dsa" | "broker" | "lead_partner"
   */
  create: async (data) => {
    const response = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create payout search record");
    return response.json();
  },

  /**
   * GET /api/update-payout/<id>/
   * Fetch a single search record by ID
   * @param {number} id
   */
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Failed to fetch payout search record with id ${id}`);
    return response.json();
  },

  /**
   * PUT /api/update-payout/<id>/
   * Full update of a search record
   * @param {number} id
   * @param {Object} data - { search, type }
   */
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update payout search record with id ${id}`);
    return response.json();
  },

  /**
   * PATCH /api/update-payout/<id>/
   * Partial update of a search record
   * @param {number} id
   * @param {Object} data - partial fields
   */
  partialUpdate: async (id, data) => {
    const response = await fetch(`${BASE_URL}/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to partially update payout search record with id ${id}`);
    return response.json();
  },

  /**
   * DELETE /api/update-payout/<id>/
   * Delete a search record
   * @param {number} id
   */
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/${id}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Failed to delete payout search record with id ${id}`);
    return { success: true, id };
  },
};

// ============================================================
//  PAYOUT AGENT
//  Types  : "dsa" | "broker" | "lead_partner"
//  Modes  : "bank_transfer" | "upi" | "cheque" | "neft/rtgs"
//  Status : "active" | "off"
// ============================================================

export const PayoutAgentService = {

  /**
   * GET /api/update-payout/agents/
   * Fetch all agent payout records
   */
  getAll: async () => {
    const response = await fetch(`${BASE_URL}/agents/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch payout agent records");
    return response.json();
  },

  /**
   * POST /api/update-payout/agents/
   * Create a new agent payout record
   * @param {Object} data
   * {
   *   agent, type, flat_fee, percentage_rate,
   *   min_amount, max_amount, cycle_day,
   *   mode, bonus, status, action_edit
   * }
   */
  create: async (data) => {
    const response = await fetch(`${BASE_URL}/agents/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create payout agent record");
    return response.json();
  },

  /**
   * GET /api/update-payout/agents/<id>/
   * Fetch a single agent payout record by ID
   * @param {number} id
   */
  getById: async (id) => {
    const response = await fetch(`${BASE_URL}/agents/${id}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Failed to fetch payout agent record with id ${id}`);
    return response.json();
  },

  /**
   * PUT /api/update-payout/agents/<id>/
   * Full update of an agent payout record
   * @param {number} id
   * @param {Object} data - all fields required
   */
  update: async (id, data) => {
    const response = await fetch(`${BASE_URL}/agents/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update payout agent record with id ${id}`);
    return response.json();
  },

  /**
   * PATCH /api/update-payout/agents/<id>/
   * Partial update of an agent payout record
   * @param {number} id
   * @param {Object} data - only the fields to update
   *
   * Common use cases:
   *   Toggle status  → { status: "active" } or { status: "off" }
   *   Toggle edit    → { action_edit: true }
   *   Update rate    → { percentage_rate: "3.50" }
   */
  partialUpdate: async (id, data) => {
    const response = await fetch(`${BASE_URL}/agents/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to partially update payout agent record with id ${id}`);
    return response.json();
  },

  /**
   * DELETE /api/update-payout/agents/<id>/
   * Delete an agent payout record
   * @param {number} id
   */
  delete: async (id) => {
    const response = await fetch(`${BASE_URL}/agents/${id}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Failed to delete payout agent record with id ${id}`);
    return { success: true, id };
  },

  /**
   * PATCH /api/update-payout/agents/<id>/
   * Convenience: toggle agent status between "active" and "off"
   * @param {number} id
   * @param {"active"|"off"} status
   */
  toggleStatus: async (id, status) => {
    return PayoutAgentService.partialUpdate(id, { status });
  },

  /**
   * PATCH /api/update-payout/agents/<id>/
   * Convenience: enable or disable the edit action flag
   * @param {number} id
   * @param {boolean} action_edit
   */
  toggleEditAction: async (id, action_edit) => {
    return PayoutAgentService.partialUpdate(id, { action_edit });
  },
};