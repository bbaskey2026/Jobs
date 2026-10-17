export interface NoAuthRawJob {
  id?: string;
  external_id?: string;
  job_title?: string;
  title?: string;
  company_name?: string;
  organization?: string;
  org_website?: string;
  department?: string;
  sector_type?: string;
  job_type?: string;
  vacancies?: number | string;
  location_state?: string;
  location_city?: string;
  is_national?: boolean;
  qualification_needed?: string;
  salary_min?: number;
  salary_max?: number;
  salary_text?: string;
  posted_at?: string;
  last_date_to_apply?: string;
  official_pdf_url?: string;
  apply_url?: string;
  details?: string;
}

export interface NoAuthApiResponse {
  status: string;
  data?: NoAuthRawJob[];
  next_page_cursor?: string;
  total_count?: number;
}
