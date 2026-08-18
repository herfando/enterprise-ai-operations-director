"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type ProductionRow = {
  ID: number;
  START_PRODUCTION: string | null;
  FINISH_PRODUCTION: string | null;
  MACHINE_NAME: string | null;
  PRODUCT_NAME: string | null;
  TOTAL_PLANNING: number | null;
  TOTAL_PRODUCTION: number | null;
  GOOD_PRODUCT: number | null;
  REJECT_PRODUCT: number | null;
  DOWNTIME_MINUTES: number | null;
  MATERIAL_NAME: string | null;
  MATERIAL_USAGE_KG: number | null;
  MATERIAL_REMAINING_KG: number | null;
  OPERATOR_NAME: string | null;
  SHIFT_OPERATOR: string | null;
  OPERATOR_GROUP: string | null;
  TARGET_STATUS: string | null;
};

type EditingRow = {
  [key: string]: string | number | null;
};

export default function ProductionDatabasePage() {
  const [rows, setRows] = useState<ProductionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<EditingRow>({});

  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);

  const [newData, setNewData] = useState<EditingRow>({});
  const [creating, setCreating] = useState(false);
  // =====================================================
  // FETCH DATA
  // =====================================================

  async function fetchProductionData() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/database/production`);

      if (!response.ok) {
        throw new Error("Failed to fetch Production database.");
      }

      const result = await response.json();

      setRows(result.data || []);
    } catch (err) {
      console.error("Production database error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load Production database.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductionData();
  }, []);

  // =====================================================
  // START EDIT
  // =====================================================

  function startEdit(row: ProductionRow) {
    setEditingId(row.ID);

    setEditingData({
      START_PRODUCTION: row.START_PRODUCTION,
      FINISH_PRODUCTION: row.FINISH_PRODUCTION,
      MACHINE_NAME: row.MACHINE_NAME,
      PRODUCT_NAME: row.PRODUCT_NAME,
      TOTAL_PLANNING: row.TOTAL_PLANNING,
      TOTAL_PRODUCTION: row.TOTAL_PRODUCTION,
      GOOD_PRODUCT: row.GOOD_PRODUCT,
      REJECT_PRODUCT: row.REJECT_PRODUCT,
      DOWNTIME_MINUTES: row.DOWNTIME_MINUTES,
      MATERIAL_NAME: row.MATERIAL_NAME,
      MATERIAL_USAGE_KG: row.MATERIAL_USAGE_KG,
      MATERIAL_REMAINING_KG: row.MATERIAL_REMAINING_KG,
      OPERATOR_NAME: row.OPERATOR_NAME,
      SHIFT_OPERATOR: row.SHIFT_OPERATOR,
      OPERATOR_GROUP: row.OPERATOR_GROUP,
      TARGET_STATUS: row.TARGET_STATUS,
    });
  }

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  function cancelEdit() {
    setEditingId(null);
    setEditingData({});
  }

  // =====================================================
  // UPDATE FIELD
  // =====================================================

  function updateField(field: string, value: string) {
    setEditingData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // =====================================================
  // SAVE
  // =====================================================

  async function saveRow(id: number) {
    try {
      setSavingId(id);

      const response = await fetch(
        `${API_BASE_URL}/database/production/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Failed to update Production data.");
      }

      setEditingId(null);
      setEditingData({});

      await fetchProductionData();
    } catch (err) {
      console.error("Production update error:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to update Production data.",
      );
    } finally {
      setSavingId(null);
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async function deleteRow(id: number) {
    const confirmed = window.confirm(`Delete Production record ID ${id}?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_BASE_URL}/database/production/${id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Failed to delete Production data.");
      }

      await fetchProductionData();
    } catch (err) {
      console.error("Production delete error:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete Production data.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================================
  // CREATE PRODUCTION DATA
  // =====================================================

  function updateNewField(field: string, value: string) {
    setNewData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function cancelAdd() {
    setShowAddForm(false);
    setNewData({});
  }

  async function createProductionData() {
    try {
      setCreating(true);

      const response = await fetch(`${API_BASE_URL}/database/production`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            result.message ||
            `Failed to create Production data. Status: ${response.status}`,
        );
      }
      setShowAddForm(false);
      setNewData({});

      await fetchProductionData();
    } catch (err) {
      console.error("Production create error:", err);

      alert(
        err instanceof Error
          ? err.message
          : "Failed to create Production data.",
      );
    } finally {
      setCreating(false);
    }
  }
  // =====================================================
  // FORMAT
  // =====================================================

  function formatNumber(value: number | null) {
    if (value === null || value === undefined) {
      return "-";
    }

    return value.toLocaleString();
  }

  function formatDate(value: string | null) {
    if (!value) {
      return "-";
    }

    return value.replace("T", " ");
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Loading Production database...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <div className="rounded-xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            Production Database
          </h1>

          <p className="mt-3 text-sm text-red-600">{error}</p>

          <button
            onClick={fetchProductionData}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen w-full min-w-0 overflow-hidden bg-slate-100 p-6">
      {" "}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Add Production Data
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new Production record.
                </p>
              </div>

              <button
                onClick={cancelAdd}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createProductionData();
              }}
            >
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {" "}
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Start Production
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={newData.START_PRODUCTION ?? ""}
                    onChange={(e) =>
                      updateNewField("START_PRODUCTION", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Finish Production
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={newData.FINISH_PRODUCTION ?? ""}
                    onChange={(e) =>
                      updateNewField("FINISH_PRODUCTION", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Machine
                  </label>
                  <input
                    required
                    value={newData.MACHINE_NAME ?? ""}
                    onChange={(e) =>
                      updateNewField("MACHINE_NAME", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Product
                  </label>
                  <input
                    required
                    value={newData.PRODUCT_NAME ?? ""}
                    onChange={(e) =>
                      updateNewField("PRODUCT_NAME", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Total Planning
                  </label>
                  <input
                    required
                    type="number"
                    value={newData.TOTAL_PLANNING ?? ""}
                    onChange={(e) =>
                      updateNewField("TOTAL_PLANNING", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Total Production
                  </label>
                  <input
                    required
                    type="number"
                    value={newData.TOTAL_PRODUCTION ?? ""}
                    onChange={(e) =>
                      updateNewField("TOTAL_PRODUCTION", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Good Product
                  </label>
                  <input
                    required
                    type="number"
                    value={newData.GOOD_PRODUCT ?? ""}
                    onChange={(e) =>
                      updateNewField("GOOD_PRODUCT", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Reject Product
                  </label>
                  <input
                    required
                    type="number"
                    value={newData.REJECT_PRODUCT ?? ""}
                    onChange={(e) =>
                      updateNewField("REJECT_PRODUCT", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Downtime Minutes
                  </label>
                  <input
                    required
                    type="number"
                    value={newData.DOWNTIME_MINUTES ?? ""}
                    onChange={(e) =>
                      updateNewField("DOWNTIME_MINUTES", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Material
                  </label>
                  <input
                    required
                    value={newData.MATERIAL_NAME ?? ""}
                    onChange={(e) =>
                      updateNewField("MATERIAL_NAME", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Material Usage KG
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={newData.MATERIAL_USAGE_KG ?? ""}
                    onChange={(e) =>
                      updateNewField("MATERIAL_USAGE_KG", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Material Remaining KG
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={newData.MATERIAL_REMAINING_KG ?? ""}
                    onChange={(e) =>
                      updateNewField("MATERIAL_REMAINING_KG", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Operator
                  </label>
                  <input
                    required
                    value={newData.OPERATOR_NAME ?? ""}
                    onChange={(e) =>
                      updateNewField("OPERATOR_NAME", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Shift
                  </label>
                  <input
                    required
                    value={newData.SHIFT_OPERATOR ?? ""}
                    onChange={(e) =>
                      updateNewField("SHIFT_OPERATOR", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Group
                  </label>
                  <input
                    required
                    value={newData.OPERATOR_GROUP ?? ""}
                    onChange={(e) =>
                      updateNewField("OPERATOR_GROUP", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Target Status
                  </label>
                  <input
                    required
                    value={newData.TARGET_STATUS ?? ""}
                    onChange={(e) =>
                      updateNewField("TARGET_STATUS", e.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelAdd}
                  disabled={creating}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <a
              href="/database"
              className="text-sm text-slate-500 hover:text-blue-600"
            >
              Database
            </a>

            <span className="text-slate-400">/</span>

            <span className="text-sm font-medium text-slate-700">
              Production
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Production Database
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Operational production data connected directly to Snowflake.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            + Add Production Data
          </button>

          <button
            onClick={fetchProductionData}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>
      {/* DATABASE INFO */}
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Department
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">Production</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Table
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            PRODUCTION_RESULT
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Records
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">{rows.length}</p>
        </div>
      </div>
      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="font-bold text-slate-900">PRODUCTION_RESULT</h2>

          <p className="mt-1 text-xs text-slate-500">
            Live data from DATABASE_SNOWFLAKE.MASTER_DATA.PRODUCTION_RESULT
          </p>
        </div>

        <div className="relative">
          <div className="max-h-[calc(100vh-280px)] w-full overflow-auto">
            <table className="w-max min-w-full border-collapse">
              {" "}
              <thead className="sticky top-0 z-30">
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {" "}
                  <th className="sticky left-0 z-20 bg-slate-50 px-4 py-3">
                    ID
                  </th>
                  <th className="px-4 py-3">Start Production</th>
                  <th className="px-4 py-3">Finish Production</th>
                  <th className="px-4 py-3">Machine</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Planning</th>
                  <th className="px-4 py-3">Production</th>
                  <th className="px-4 py-3">Good</th>
                  <th className="px-4 py-3">Reject</th>
                  <th className="px-4 py-3">Downtime</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3">Usage KG</th>
                  <th className="px-4 py-3">Remaining KG</th>
                  <th className="px-4 py-3">Operator</th>
                  <th className="px-4 py-3">Shift</th>
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Target Status</th>
                  <th className="sticky right-0 z-20 bg-slate-50 px-4 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isEditing = editingId === row.ID;

                  return (
                    <tr
                      key={row.ID}
                      className="border-b border-slate-100 text-sm last:border-b-0"
                    >
                      {/* ID */}

                      <td className="sticky left-0 z-10 bg-white px-4 py-3 font-semibold text-slate-900">
                        {row.ID}
                      </td>

                      {/* START */}

                      <td className="px-4 py-3 text-slate-600">
                        {isEditing ? (
                          <input
                            value={editingData.START_PRODUCTION ?? ""}
                            onChange={(e) =>
                              updateField("START_PRODUCTION", e.target.value)
                            }
                            className="w-44 rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        ) : (
                          formatDate(row.START_PRODUCTION)
                        )}
                      </td>

                      {/* FINISH */}

                      <td className="px-4 py-3 text-slate-600">
                        {isEditing ? (
                          <input
                            value={editingData.FINISH_PRODUCTION ?? ""}
                            onChange={(e) =>
                              updateField("FINISH_PRODUCTION", e.target.value)
                            }
                            className="w-44 rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        ) : (
                          formatDate(row.FINISH_PRODUCTION)
                        )}
                      </td>

                      {/* MACHINE */}

                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            value={editingData.MACHINE_NAME ?? ""}
                            onChange={(e) =>
                              updateField("MACHINE_NAME", e.target.value)
                            }
                            className="w-48 rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        ) : (
                          <span className="font-medium text-slate-800">
                            {row.MACHINE_NAME || "-"}
                          </span>
                        )}
                      </td>

                      {/* PRODUCT */}

                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            value={editingData.PRODUCT_NAME ?? ""}
                            onChange={(e) =>
                              updateField("PRODUCT_NAME", e.target.value)
                            }
                            className="w-56 rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        ) : (
                          <span className="text-slate-700">
                            {row.PRODUCT_NAME || "-"}
                          </span>
                        )}
                      </td>

                      {/* PLANNING */}

                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingData.TOTAL_PLANNING ?? ""}
                            onChange={(e) =>
                              updateField("TOTAL_PLANNING", e.target.value)
                            }
                            className="w-28 rounded border border-slate-300 px-2 py-1 text-right text-xs"
                          />
                        ) : (
                          formatNumber(row.TOTAL_PLANNING)
                        )}
                      </td>

                      {/* PRODUCTION */}

                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingData.TOTAL_PRODUCTION ?? ""}
                            onChange={(e) =>
                              updateField("TOTAL_PRODUCTION", e.target.value)
                            }
                            className="w-28 rounded border border-slate-300 px-2 py-1 text-right text-xs"
                          />
                        ) : (
                          formatNumber(row.TOTAL_PRODUCTION)
                        )}
                      </td>

                      {/* GOOD */}

                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingData.GOOD_PRODUCT ?? ""}
                            onChange={(e) =>
                              updateField("GOOD_PRODUCT", e.target.value)
                            }
                            className="w-28 rounded border border-slate-300 px-2 py-1 text-right text-xs"
                          />
                        ) : (
                          formatNumber(row.GOOD_PRODUCT)
                        )}
                      </td>

                      {/* REJECT */}

                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingData.REJECT_PRODUCT ?? ""}
                            onChange={(e) =>
                              updateField("REJECT_PRODUCT", e.target.value)
                            }
                            className="w-28 rounded border border-slate-300 px-2 py-1 text-right text-xs"
                          />
                        ) : (
                          formatNumber(row.REJECT_PRODUCT)
                        )}
                      </td>

                      {/* DOWNTIME */}

                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingData.DOWNTIME_MINUTES ?? ""}
                            onChange={(e) =>
                              updateField("DOWNTIME_MINUTES", e.target.value)
                            }
                            className="w-24 rounded border border-slate-300 px-2 py-1 text-right text-xs"
                          />
                        ) : row.DOWNTIME_MINUTES !== null ? (
                          `${row.DOWNTIME_MINUTES} min`
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* MATERIAL */}

                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            value={editingData.MATERIAL_NAME ?? ""}
                            onChange={(e) =>
                              updateField("MATERIAL_NAME", e.target.value)
                            }
                            className="w-40 rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        ) : (
                          row.MATERIAL_NAME || "-"
                        )}
                      </td>

                      {/* USAGE */}

                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editingData.MATERIAL_USAGE_KG ?? ""}
                            onChange={(e) =>
                              updateField("MATERIAL_USAGE_KG", e.target.value)
                            }
                            className="w-24 rounded border border-slate-300 px-2 py-1 text-right text-xs"
                          />
                        ) : row.MATERIAL_USAGE_KG !== null ? (
                          row.MATERIAL_USAGE_KG.toLocaleString()
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* REMAINING */}

                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editingData.MATERIAL_REMAINING_KG ?? ""}
                            onChange={(e) =>
                              updateField(
                                "MATERIAL_REMAINING_KG",
                                e.target.value,
                              )
                            }
                            className="w-24 rounded border border-slate-300 px-2 py-1 text-right text-xs"
                          />
                        ) : row.MATERIAL_REMAINING_KG !== null ? (
                          row.MATERIAL_REMAINING_KG.toLocaleString()
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* OPERATOR */}

                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            value={editingData.OPERATOR_NAME ?? ""}
                            onChange={(e) =>
                              updateField("OPERATOR_NAME", e.target.value)
                            }
                            className="w-40 rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        ) : (
                          row.OPERATOR_NAME || "-"
                        )}
                      </td>

                      {/* SHIFT */}

                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            value={editingData.SHIFT_OPERATOR ?? ""}
                            onChange={(e) =>
                              updateField("SHIFT_OPERATOR", e.target.value)
                            }
                            className="w-24 rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        ) : (
                          row.SHIFT_OPERATOR || "-"
                        )}
                      </td>

                      {/* GROUP */}

                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            value={editingData.OPERATOR_GROUP ?? ""}
                            onChange={(e) =>
                              updateField("OPERATOR_GROUP", e.target.value)
                            }
                            className="w-24 rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        ) : (
                          row.OPERATOR_GROUP || "-"
                        )}
                      </td>

                      {/* TARGET STATUS */}

                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            value={editingData.TARGET_STATUS ?? ""}
                            onChange={(e) =>
                              updateField("TARGET_STATUS", e.target.value)
                            }
                            className="w-28 rounded border border-slate-300 px-2 py-1 text-xs"
                          />
                        ) : (
                          <span
                            className={`rounded-md px-2 py-1 text-xs font-semibold ${
                              row.TARGET_STATUS === "Sudah Capai"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {row.TARGET_STATUS || "-"}
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="sticky right-0 z-10 bg-white px-4 py-3 text-center">
                        {isEditing ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => saveRow(row.ID)}
                              disabled={savingId === row.ID}
                              className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {savingId === row.ID ? "Saving..." : "Save"}
                            </button>

                            <button
                              onClick={cancelEdit}
                              disabled={savingId === row.ID}
                              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => startEdit(row)}
                              disabled={deletingId === row.ID}
                              className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteRow(row.ID)}
                              disabled={deletingId === row.ID}
                              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === row.ID ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
