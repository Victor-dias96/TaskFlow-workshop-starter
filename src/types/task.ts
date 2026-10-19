export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type TaskFilter = "all" | "pending" | "completed";
