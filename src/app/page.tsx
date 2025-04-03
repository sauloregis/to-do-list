"use client";
import { useState, useEffect } from "react";
import { getTasks, createTask, toggleTask, deleteTask } from "./actions/taskActions";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function Home() {
  const [tasks, setTasks] = useState<{ id: string; title: string; description: string | null; completed: boolean }[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
  }

  async function handleCreateTask() {
    if (!title || !description) return;
    await createTask(title, description);
    setTitle("");
    setDescription("");
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

      <div className="flex mb-4" >
        <input
          type="text"
          placeholder="Nova tarefa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Descrição..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="flex-grow p-2 border rounded"
        />
        <button onClick={handleCreateTask} className="ml-2 p-2 bg-blue-500 text-white rounded">
          Adicionar
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center mb-2 p-2 border rounded">
            <div>
              <span
                className={`cursor-pointer ${task.completed ? "line-through text-gray-500" : ""}`}
                onClick={() => handleToggleTask(task.id, task.completed)}
              >
                {task.title}
              </span>
              <p className="text-sm text-gray-700">{task.description}</p>
            </div>
            <button onClick={() => handleDeleteTask(task.id)} className="text-red-500">
              <FaTrash className="h-6 w-6" />
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
