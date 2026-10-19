import type { Task } from "../types/task";

type TaskSummaryProps = {
  tasks: Task[];
};

export function TaskSummary({ tasks }: TaskSummaryProps) {
  const pendingCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <ul className="task-summary" aria-label="Resumo das tarefas">
      <li>Total: {tasks.length}</li>
      <li>Pendentes: {pendingCount}</li>
      <li>Concluídas: {completedCount}</li>
    </ul>
  );
}
