import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { useTasks } from "./hooks/useTasks";

export function App() {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

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
          <TaskList tasks={tasks} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
        </section>
      </main>
    </div>
  );
}
