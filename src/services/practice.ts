import { supabase } from "@/integrations/supabase/client";

export type QuizQuestion = {
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
};

export type Lesson = {
  intro: string;
  explanation: string;
  example_code: string;
  language: string;
  breakdown: string[];
  quiz: QuizQuestion[];
  tasks: string[];
};

export async function fetchLesson(topic: string, hint: string): Promise<Lesson> {
  const { data, error } = await supabase.functions.invoke("practice-lesson", {
    body: { topic, hint },
  });
  if (error) throw new Error(error.message || "Request failed");
  if (data?.error) throw new Error(data.error);
  return data as Lesson;
}

export type ChatMsg = { role: "user" | "assistant"; content: string };

export async function askMentor(
  topic: string,
  lessonContext: string,
  messages: ChatMsg[],
): Promise<string> {
  const { data, error } = await supabase.functions.invoke("buddy-mentor", {
    body: { topic, lessonContext, messages },
  });
  if (error) throw new Error(error.message || "Request failed");
  if (data?.error) throw new Error(data.error);
  return (data?.reply as string) ?? "";
}