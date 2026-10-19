import { useState } from "react";
import { TaskFilters } from "./components/TaskFilters";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskSummary } from "./components/TaskSummary";
import { useTasks } from "./hooks/useTasks";
import type { TaskFilter } from "./types/task";

export function App() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>("all");

  const visibleTasks = tasks.filter((task) => {
    if (filter === "pending") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  });

  return (
    <div className="app">
      <header className="app__header">
        <h1>TaskFlow</h1>
        <p>Organize as tarefas da oficina em um só lugar.</p>
      </header>
      <main className="app__main">
        <TaskForm onAddTask={addTask} />
        <section className="task-section" aria-labelledby="task-list-heading">
          <h2 id="task-list-heading">Tarefas</h2>
          <TaskSummary tasks={tasks} />
          <TaskFilters filter={filter} onFilterChange={setFilter} />
          <TaskList tasks={visibleTasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
        </section>
      </main>
    </div>
  );
}
