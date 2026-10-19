import type { Task } from "../types/task";

type TaskItemProps = {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export function TaskItem({ task, onToggleTask, onDeleteTask }: TaskItemProps) {
  return (
    <li className={task.completed ? "task-item task-item--completed" : "task-item"}>
      <label className="task-item__label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => {
            onToggleTask(task.id);
          }}
        />
        <span>{task.title}</span>
      </label>
      <button
        type="button"
        aria-label={`Excluir tarefa ${task.title}`}
        onClick={() => {
          onDeleteTask(task.id);
        }}
      >
        Excluir
      </button>
    </li>
  );
}
