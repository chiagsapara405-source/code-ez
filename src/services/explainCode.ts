import { supabase } from "@/integrations/supabase/client";

export type ExplainResult = {
  explanation: string;
  summary: string;
  mistakes: string;
  questions: string[];
  tasks: string[];
};

export async function explainCode(
  code: string,
  language: string,
): Promise<ExplainResult> {
  const { data, error } = await supabase.functions.invoke("explain-code", {
    body: { code, language },
  });
  if (error) throw new Error(error.message || "Request failed");
  if (data?.error) throw new Error(data.error);
  return data as ExplainResult;
}