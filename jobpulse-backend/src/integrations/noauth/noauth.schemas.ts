import { z } from 'zod';

export const noAuthRawJobSchema = z.object({
  id: z.string().optional(),
  external_id: z.string().optional(),
  job_title: z.string().optional(),
  title: z.string().optional(),
  company_name: z.string().optional(),
  organization: z.string().optional(),
  org_website: z.string().url().optional().or(z.literal('')),
  department: z.string().optional(),
  sector_type: z.string().optional(),
  job_type: z.string().optional(),
  vacancies: z.union([z.number(), z.string()]).optional(),
  location_state: z.string().optional(),
  location_city: z.string().optional(),
  is_national: z.boolean().optional(),
  qualification_needed: z.string().optional(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  salary_text: z.string().optional(),
  posted_at: z.string().optional(),
  last_date_to_apply: z.string().optional(),
  official_pdf_url: z.string().url().optional().or(z.literal('')),
  apply_url: z.string().url().optional().or(z.literal('')),
  details: z.string().optional()
});

export const noAuthApiResponseSchema = z.object({
  status: z.string().optional(),
  data: z.array(noAuthRawJobSchema).optional(),
  next_page_cursor: z.string().optional(),
  total_count: z.number().optional()
});
