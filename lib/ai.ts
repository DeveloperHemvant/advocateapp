import { apiFetch } from './apiClient';

export type AiDraftRequest = {
  document_type: string;
  case_facts: string;
  court_name?: string;
  client_name?: string;
  section?: string;
  extra?: Record<string, unknown>;
};

export type AiDraftResponse = {
  summary?: string;
  draft: string;
  success?: boolean;
  validation?: unknown;
  legal_sections?: unknown;
  precedents?: unknown;
  safety_flags?: string[];
};

export async function generateAiDraft(input: AiDraftRequest) {
  return apiFetch<AiDraftResponse>('/ai/drafts', {
    method: 'POST',
    body: JSON.stringify({
      document_type: input.document_type,
      case_facts: input.case_facts,
      court_name: input.court_name,
      client_name: input.client_name,
      section: input.section,
      extra: input.extra ?? {},
    }),
  });
}

