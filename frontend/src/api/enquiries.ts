import { api } from "./client";

export interface EnquiryCreatePayload {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
  budget?: string;
  timeline?: string;
}

export interface EnquiryCreatedResponse {
  id: number;
  created_at: string;
}

export interface EnquiryListItem {
  id: number;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  budget: string | null;
  timeline: string | null;
  status: "new" | "in_progress" | "closed";
  created_at: string;
}

export interface EnquiryDetail extends EnquiryListItem {
  message: string;
  notes: string | null;
}

export interface PaginatedEnquiries {
  items: EnquiryListItem[];
  total: number;
  page: number;
  size: number;
}

export interface StatusUpdate {
  status?: "new" | "in_progress" | "closed";
  notes?: string;
}

export const enquiriesApi = {
  submit: (payload: EnquiryCreatePayload) =>
    api.post<EnquiryCreatedResponse>("/api/enquiries", payload),

  list: (page = 1, size = 20, status?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (status && status !== "all") {
      params.set("status", status);
    }
    return api.get<PaginatedEnquiries>(`/api/enquiries?${params.toString()}`);
  },

  get: (id: number) =>
    api.get<EnquiryDetail>(`/api/enquiries/${id}`),

  update: (id: number, patch: StatusUpdate) =>
    api.patch<EnquiryDetail>(`/api/enquiries/${id}`, patch),
};
