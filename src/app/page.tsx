"use client";
import { useState, useEffect } from "react";
import { getTasks, createTask, toggleTask, deleteTask } from "./actions/taskActions";

export default function Home() {
  const [tasks, setTasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
  }

  async function handleCreateTask() {
    if (!title) return;
    await createTask(title);
    setTitle("");
    loadTasks();
  }

  async function handleToggleTask(id: string, completed: boolean) {
    await toggleTask(id, !completed);
    loadTasks();
  }

  async function handleDeleteTask(id: string) {
    await deleteTask(id);
    loadTasks();
  }

  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lista de Tarefas</h1>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Nova tarefa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow p-2 border rounded"
        />
        <button onClick={handleCreateTask} className="ml-2 p-2 bg-blue-500 text-white rounded">
          Adicionar
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center mb-2 p-2 border rounded">
            <span
              className={`cursor-pointer ${task.completed ? "line-through text-gray-500" : ""}`}
              onClick={() => handleToggleTask(task.id, task.completed)}
            >
              {task.title}
            </span>
            <button onClick={() => handleDeleteTask(task.id)} className="text-red-500">
              ✖
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
