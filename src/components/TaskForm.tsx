import { useState, type FormEvent } from "react";

type TaskFormProps = {
  onAddTask: (title: string) => void;
};

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState<string>("");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle === "") {
      return;
    }

    onAddTask(trimmedTitle);
    setTitle("");
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
            setTitle(event.target.value);
          }}
          placeholder="O que você precisa fazer?"
        />
        <button type="submit">Adicionar</button>
      </div>
    </form>
  );
}
