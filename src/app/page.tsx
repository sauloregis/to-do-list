"use client";
import { useState, useEffect } from "react";
import { getTasks, createTask, toggleTask, deleteTask, updateTask } from "./actions/taskActions";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { Task } from "../../src/interfaces";

export default function Home() {
  const [tasks, setTasks] = useState<{ id: string; title: string; description: string | null; completed: boolean }[]>([]);
  const [title, setTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks(): Promise<void> {
    const data = await getTasks();
    setTasks(data);
  }

  async function handleCreateTask(): Promise<void> {
    if (!title.trim()) return;
    
    await createTask(title, description || "");
    setTitle("");
    setDescription("");
    loadTasks();
  }

  async function handleToggleTask(id: string, completed: boolean): Promise<void> {
    await toggleTask(id, !completed);
    loadTasks();
  }

  async function handleDeleteTask(id: string): Promise<void> {
    await deleteTask(id);
    loadTasks();
  }

  function startEditing(task: Task): void {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingDescription(task.description || "");
  }

  function cancelEditing(): void{
    setEditingTaskId(null);
    setEditingTitle("");
    setEditingDescription("");
  }

  async function handleUpdateTask(id: string): Promise<void> {
    if (!editingTitle || !editingDescription) return;
    await updateTask(id, editingTitle, editingDescription);
    cancelEditing();
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
            {editingTaskId === task.id ? (
              // Modo de edição
              <div className="flex flex-col flex-grow">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="mb-2 p-2 border rounded"
                />
                <input
                  type="text"
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  className="mb-2 p-2 border rounded"
                />
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleUpdateTask(task.id)} 
                    className="p-2 bg-green-500 text-white rounded"
                  >
                    <FaSave />
                  </button>
                  <button 
                    onClick={cancelEditing} 
                    className="p-2 bg-gray-500 text-white rounded"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ) : (
              // Modo de visualização
              <>
                <div className="flex-grow">
                  <span
                    className={`cursor-pointer ${task.completed ? "line-through text-gray-500" : ""}`}
                    onClick={() => handleToggleTask(task.id, task.completed)}
                  >
                    {task.title}
                  </span>
                  <p className="text-sm text-gray-700">{task.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => startEditing(task)} 
                    className="text-blue-500"
                  >
                    <FaEdit className="h-6 w-6" />
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(task.id)} 
                    className="text-red-500"
                  >
                    <FaTrash className="h-6 w-6" />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
