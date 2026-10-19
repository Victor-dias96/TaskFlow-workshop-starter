import { useState, type FormEvent } from "react";

type TaskFormProps = {
  onAddTask: (title: string) => void;
};

const TITLE_MAX_LENGTH = 80;

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  function validateTitle(value: string): string | null {
    const trimmedTitle = value.trim();

    if (trimmedTitle === "") {
      return "Informe um título para a tarefa.";
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      return "O título deve ter no máximo 80 caracteres.";
    }

    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const validationError = validateTitle(title);

    if (validationError !== null) {
      setError(validationError);
      return;
    }

    onAddTask(title.trim());
    setTitle("");
    setError(null);
  }

  function handleTitleChange(value: string): void {
    setTitle(value);

    if (error !== null && validateTitle(value) === null) {
      setError(null);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="task-title">Nova tarefa</label>
      <div className="task-form__row">
        <input
          id="task-title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => {
            handleTitleChange(event.target.value);
          }}
          placeholder="O que você precisa fazer?"
          aria-invalid={error !== null}
          aria-describedby={error !== null ? "task-title-error" : undefined}
        />
        <button type="submit">Adicionar</button>
      </div>
      {error !== null && (
        <p id="task-title-error" className="task-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
