import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import {
  enquiriesApi,
  EnquiryDetail,
  EnquiryListItem,
} from "../../api/enquiries";
import { ApiError } from "../../api/client";
import { brand, formatBudgetLabel } from "../../config/brand";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import "./AdminDashboardPage.css";

const STATUS_FILTERS = [
  { id: "all", label: "All Enquiries" },
  { id: "new", label: "New" },
  { id: "in_progress", label: "In Progress" },
  { id: "closed", label: "Closed" },
];

export default function AdminDashboardPage() {
  useDocumentMeta({
    title: `Admin Dashboard — ${brand.name}`,
    description: "Manage client enquiries.",
    robots: "noindex, nofollow",
  });

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Enquiries list state
  const [enquiries, setEnquiries] = useState<EnquiryListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // Selected enquiry detail state
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Editing state for detail view
  const [editStatus, setEditStatus] = useState<"new" | "in_progress" | "closed">("new");
  const [editNotes, setEditNotes] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 1. Check auth on mount
  useEffect(() => {
    let isMounted = true;
    authApi
      .me()
      .then((res) => {
        if (isMounted) {
          setCurrentUser(res.username);
          setLoadingUser(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          if (err instanceof ApiError && err.status === 401) {
            navigate("/admin/login", { replace: true });
          } else {
            navigate("/admin/login", { replace: true });
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // 2. Fetch enquiries list with status filtering
  const fetchEnquiries = useCallback(
    async (targetPage: number, currentFilter: string) => {
      setLoadingList(true);
      setListError(null);
      try {
        const data = await enquiriesApi.list(
          targetPage,
          pageSize,
          currentFilter === "all" ? undefined : currentFilter
        );
        setEnquiries(data.items);
        setTotal(data.total);
        setPage(data.page);
      } catch (err: unknown) {
        if (err instanceof ApiError && err.status === 401) {
          navigate("/admin/login", { replace: true });
          return;
        }
        setListError("Unable to load enquiries. Check your connection or try refreshing.");
      } finally {
        setLoadingList(false);
      }
    },
    [pageSize, navigate]
  );

  useEffect(() => {
    if (currentUser) {
      fetchEnquiries(page, statusFilter);
    }
  }, [currentUser, page, statusFilter, fetchEnquiries]);

  // Filter change handler
  const handleFilterChange = (filterId: string) => {
    setStatusFilter(filterId);
    setPage(1);
  };

  // 3. Open enquiry details
  const handleSelectEnquiry = async (item: EnquiryListItem) => {
    setLoadingDetail(true);
    setDetailError(null);
    setSaveSuccess(false);

    try {
      const detail = await enquiriesApi.get(item.id);
      setSelectedEnquiry(detail);
      setEditStatus(detail.status as "new" | "in_progress" | "closed");
      setEditNotes(detail.notes || "");
    } catch {
      setDetailError("Failed to load enquiry details.");
    } finally {
      setLoadingDetail(false);
    }
  };

  // 4. Save enquiry status / notes
  const handleSaveDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    setIsSaving(true);
    setDetailError(null);
    setSaveSuccess(false);

    try {
      const updated = await enquiriesApi.update(selectedEnquiry.id, {
        status: editStatus,
        notes: editNotes,
      });

      setSelectedEnquiry(updated);
      setSaveSuccess(true);

      // Also update in list view
      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === updated.id ? { ...item, status: updated.status } : item
        )
      );

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 403) {
        setDetailError("CSRF verification failed. Please refresh the page and try again.");
      } else {
        setDetailError("Failed to update enquiry.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Logout
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  if (loadingUser) {
    return (
      <div className="admin-loading-screen" role="status" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p>Verifying admin session...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page animate-in">
      <div className="container">
        {/* Top Header Bar */}
        <header className="admin-header">
          <div>
            <div className="admin-title-row">
              <h1 className="admin-title">Enquiries Inbox</h1>
              <span className="badge badge-admin">Protected</span>
            </div>
            <p className="admin-subtitle">
              Logged in as <strong>{currentUser}</strong>
            </p>
          </div>
          <div className="admin-header-actions">
            <button
              type="button"
              onClick={() => fetchEnquiries(page, statusFilter)}
              className="btn btn-secondary btn-sm"
              disabled={loadingList}
              aria-label="Refresh list"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
            >
              Sign Out
            </button>
          </div>
        </header>

        {listError && (
          <div className="alert alert-error" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{listError}</span>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="admin-filters-bar" role="tablist" aria-label="Filter enquiries by status">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={statusFilter === f.id}
              className={`filter-tab ${statusFilter === f.id ? "filter-tab--active" : ""}`}
              onClick={() => handleFilterChange(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="admin-content-layout">
          {/* Enquiries Table Card */}
          <section className="enquiries-list-card" aria-labelledby="inbox-heading">
            <h2 id="inbox-heading" className="sr-only">
              Enquiries List
            </h2>

            {loadingList ? (
              <div className="table-loading" role="status">
                <span className="spinner" aria-hidden="true" />
                <p>Loading enquiries...</p>
              </div>
            ) : enquiries.length === 0 ? (
              <div className="empty-state" role="status">
                <div className="empty-icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <h3>No enquiries found</h3>
                <p>
                  {statusFilter !== "all"
                    ? `There are no enquiries with status '${statusFilter}'.`
                    : "When visitors submit project briefs via the contact form, they will appear here."}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="enquiries-table">
                  <thead>
                    <tr>
                      <th scope="col">Status</th>
                      <th scope="col">Client</th>
                      <th scope="col">Service</th>
                      <th scope="col">Budget</th>
                      <th scope="col">Submitted</th>
                      <th scope="col" className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((item) => (
                      <tr
                        key={item.id}
                        className={selectedEnquiry?.id === item.id ? "row-selected" : ""}
                        onClick={() => handleSelectEnquiry(item)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelectEnquiry(item);
                          }
                        }}
                        aria-label={`View enquiry from ${item.name}`}
                      >
                        <td>
                          <span className={`status-pill status-${item.status}`}>
                            {item.status === "in_progress"
                              ? "In Progress"
                              : item.status === "closed"
                              ? "Closed"
                              : "New"}
                          </span>
                        </td>
                        <td>
                          <div className="client-info">
                            <span className="client-name">{item.name}</span>
                            <span className="client-email">{item.email}</span>
                            {item.company && (
                              <span className="client-company">{item.company}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="service-text">{item.service || "General"}</span>
                        </td>
                        <td>
                          <span className="budget-text">
                            {item.budget ? formatBudgetLabel(item.budget) : "—"}
                          </span>
                        </td>
                        <td>
                          <span className="date-text">
                            {new Date(item.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            className="btn-text-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectEnquiry(item);
                            }}
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <footer className="table-pagination">
                <span className="pagination-info">
                  Page {page} of {totalPages} ({total} total)
                </span>
                <div className="pagination-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={page <= 1 || loadingList}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={page >= totalPages || loadingList}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </footer>
            )}
          </section>

          {/* Enquiry Detail Panel */}
          {selectedEnquiry && (
            <aside className="enquiry-detail-panel" aria-labelledby="detail-heading">
              <div className="detail-panel-header">
                <div>
                  <h3 id="detail-heading" className="detail-title">
                    Enquiry #{selectedEnquiry.id}
                  </h3>
                  <span className="detail-date">
                    Received {new Date(selectedEnquiry.created_at).toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  className="close-detail-btn"
                  onClick={() => setSelectedEnquiry(null)}
                  aria-label="Close detail view"
                >
                  ✕
                </button>
              </div>

              {loadingDetail ? (
                <div className="detail-loading" role="status">
                  <span className="spinner" aria-hidden="true" />
                  <p>Loading details...</p>
                </div>
              ) : (
                <div className="detail-body">
                  {detailError && (
                    <div className="alert alert-error" role="alert">
                      <span>{detailError}</span>
                    </div>
                  )}

                  {saveSuccess && (
                    <div className="alert alert-success" role="alert">
                      <span>Enquiry updated successfully.</span>
                    </div>
                  )}

                  <div className="detail-section">
                    <h4>Contact Details</h4>
                    <dl className="meta-list">
                      <div>
                        <dt>Name</dt>
                        <dd>{selectedEnquiry.name}</dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>
                          <a href={`mailto:${selectedEnquiry.email}`} className="email-link">
                            {selectedEnquiry.email}
                          </a>
                        </dd>
                      </div>
                      {selectedEnquiry.company && (
                        <div>
                          <dt>Company</dt>
                          <dd>{selectedEnquiry.company}</dd>
                        </div>
                      )}
                      {selectedEnquiry.service && (
                        <div>
                          <dt>Service</dt>
                          <dd>{selectedEnquiry.service}</dd>
                        </div>
                      )}
                      {selectedEnquiry.budget && (
                        <div>
                          <dt>Budget</dt>
                          <dd>{formatBudgetLabel(selectedEnquiry.budget)}</dd>
                        </div>
                      )}
                      {selectedEnquiry.timeline && (
                        <div>
                          <dt>Timeline</dt>
                          <dd>{selectedEnquiry.timeline}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="detail-section">
                    <h4>Message / Project Brief</h4>
                    <div className="detail-message-box">
                      <p>{selectedEnquiry.message}</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveDetail} className="detail-form">
                    <div className="form-group">
                      <label htmlFor="detail-status" className="form-label">
                        Update Status
                      </label>
                      <select
                        id="detail-status"
                        name="status"
                        value={editStatus}
                        onChange={(e) =>
                          setEditStatus(e.target.value as "new" | "in_progress" | "closed")
                        }
                        className="form-select"
                        disabled={isSaving}
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="detail-notes" className="form-label">
                        Internal Notes
                      </label>
                      <textarea
                        id="detail-notes"
                        name="notes"
                        rows={4}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add notes about discovery calls, quotes, or status..."
                        className="form-textarea"
                        disabled={isSaving}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-save"
                      disabled={isSaving}
                      aria-busy={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="spinner" aria-hidden="true" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
