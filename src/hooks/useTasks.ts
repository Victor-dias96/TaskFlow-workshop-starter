import { useEffect, useState } from "react";
import type { Task } from "../types/task";

export const TASKS_STORAGE_KEY = "taskflow.tasks";

const initialTasks: Task[] = [
  {
    id: "seed-explorar",
    title: "Explorar o código do TaskFlow",
    completed: false,
    createdAt: "2026-10-19T12:00:00.000Z",
  },
  {
    id: "seed-adicionar",
    title: "Adicionar uma tarefa nova",
    completed: false,
    createdAt: "2026-10-19T12:05:00.000Z",
  },
  {
    id: "seed-concluir",
    title: "Marcar uma tarefa como concluída",
    completed: true,
    createdAt: "2026-10-19T12:10:00.000Z",
  },
];

type UseTasksResult = {
  tasks: Task[];
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.completed === "boolean" &&
    typeof candidate.createdAt === "string"
  );
}

function loadTasks(): Task[] {
  try {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);

    if (storedTasks === null) {
      return initialTasks;
    }

    const parsed: unknown = JSON.parse(storedTasks);

    if (!Array.isArray(parsed) || !parsed.every(isTask)) {
      return initialTasks;
    }

    return parsed;
  } catch {
    return initialTasks;
  }
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(title: string): void {
    const trimmedTitle = title.trim();

    if (trimmedTitle === "") {
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((currentTasks) => [...currentTasks, task]);
  }

  function toggleTask(id: string): void {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: string): void {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  return { tasks, addTask, toggleTask, deleteTask };
}
