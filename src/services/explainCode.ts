import { supabase } from "@/integrations/supabase/client";

export type ExplainResult = {
  summary: string;
  concepts: string[];
  mistakes: string[];
  questions: string[];
  tasks: string[];
  explanation: string[];
  fixed_code: string;
};

export async function explainCode(
  code: string,
  language: string,
  examMode = false,
): Promise<ExplainResult> {
  const { data, error } = await supabase.functions.invoke("explain-code", {
    body: { code: code.trim(), language, examMode },
  });
  if (error) throw new Error(error.message || "Request failed");
  if (data?.error) throw new Error(data.error);
  return data as ExplainResult;
}