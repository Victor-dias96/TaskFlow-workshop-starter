import type { TaskFilter } from "../types/task";

type TaskFiltersProps = {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
};

const filters: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendentes" },
  { value: "completed", label: "Concluídas" },
];

export function TaskFilters({ filter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="task-filters" role="group" aria-label="Filtrar tarefas">
      {filters.map((option) => {
        const isActive = filter === option.value;

        return (
          <button
            key={option.value}
            type="button"
            className={
              isActive ? "task-filters__button task-filters__button--active" : "task-filters__button"
            }
            aria-pressed={isActive}
            onClick={() => {
              onFilterChange(option.value);
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
