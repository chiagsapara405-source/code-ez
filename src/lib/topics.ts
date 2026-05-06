import {
  Boxes,
  MousePointer2,
  RotateCw,
  FunctionSquare,
  Repeat2,
  Type,
  Link2,
  Layers,
  ArrowDownNarrowWide,
  ListOrdered,
  type LucideIcon,
} from "lucide-react";

export type Difficulty = "Beginner" | "Intermediate";

export type Topic = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  icon: LucideIcon;
  lesson_prompt: string;
};

export const TOPICS: Topic[] = [
  {
    id: "arrays",
    title: "Arrays",
    description: "Store and access lists of values efficiently.",
    difficulty: "Beginner",
    icon: Boxes,
    lesson_prompt: "Arrays — fixed-size collections, indexing, iteration",
  },
  {
    id: "pointers",
    title: "Pointers",
    description: "Variables that hold memory addresses.",
    difficulty: "Intermediate",
    icon: MousePointer2,
    lesson_prompt: "Pointers — addresses, dereferencing, common pitfalls",
  },
  {
    id: "loops",
    title: "Loops",
    description: "Repeat instructions with for, while and do-while.",
    difficulty: "Beginner",
    icon: RotateCw,
    lesson_prompt: "Loops — for, while, do-while, break/continue",
  },
  {
    id: "functions",
    title: "Functions",
    description: "Reusable blocks of code with inputs and outputs.",
    difficulty: "Beginner",
    icon: FunctionSquare,
    lesson_prompt: "Functions — parameters, return values, scope",
  },
  {
    id: "recursion",
    title: "Recursion",
    description: "Functions that call themselves to solve problems.",
    difficulty: "Intermediate",
    icon: Repeat2,
    lesson_prompt: "Recursion — base case, recursive case, call stack",
  },
  {
    id: "strings",
    title: "Strings",
    description: "Work with text, characters and common operations.",
    difficulty: "Beginner",
    icon: Type,
    lesson_prompt: "Strings — characters, length, common methods",
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    description: "Nodes connected by pointers, dynamic in size.",
    difficulty: "Intermediate",
    icon: Link2,
    lesson_prompt: "Linked Lists — nodes, head, traversal, insertion",
  },
  {
    id: "oop",
    title: "OOP Basics",
    description: "Classes, objects, encapsulation, inheritance.",
    difficulty: "Intermediate",
    icon: Layers,
    lesson_prompt: "OOP basics — class, object, methods, inheritance",
  },
  {
    id: "sorting",
    title: "Sorting",
    description: "Arrange items in order: bubble, selection, merge.",
    difficulty: "Intermediate",
    icon: ArrowDownNarrowWide,
    lesson_prompt: "Sorting — bubble sort, selection sort, intuition",
  },
  {
    id: "stack-queue",
    title: "Stack & Queue",
    description: "LIFO and FIFO data structures with real uses.",
    difficulty: "Beginner",
    icon: ListOrdered,
    lesson_prompt: "Stack and Queue — LIFO vs FIFO, push/pop, enqueue/dequeue",
  },
];

export const getTopic = (id: string) => TOPICS.find((t) => t.id === id);