"use client";
import { useState, useEffect } from "react";
import { getTasks, getGroups, createTask, createGroup, toggleTask, deleteTask, updateTask } from "./actions/taskActions";
import { FaRegTrashAlt, FaRegEdit , FaSave, FaTimes } from "react-icons/fa";
import { Task } from "../../src/interfaces";

export default function Home() {
  const [tasks, setTasks] = useState<{
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    group?: {
      id: string;
      name: string;
    } | null;
  }[]>([]);  
  const [title, setTitle] = useState("");
  const [group, setGroup] = useState("");
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<string>("");
  const [description, setDescription] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    loadTasks();
    loadGroups();
  }, []);

  async function loadTasks(): Promise<void> {
    const data = await getTasks();
    setTasks(data);
  }

  async function loadGroups() {
    const data = await getGroups();
    setGroups(data);
  }

  async function handleCreateTask(): Promise<void> {
    if (!title.trim()){
      setTitleError("O título é obrigatório.");
      return;
    }
    
    setTitleError("");
    await createTask(title.trim(), description.trim() || "", group);
    setTitle("");
    setDescription("");
    setGroup("");
    loadTasks();
  }

  async function handleCreateGroup() {
    if (!newGroupName.trim()) return;
    await createGroup(newGroupName.trim());
    setNewGroupName("");
    loadGroups();
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
    setEditingGroup(task.groupId || "");
  }

  function cancelEditing(): void{
    setEditingTaskId(null);
    setEditingTitle("");
    setEditingDescription("");
  }

  async function handleUpdateTask(id: string): Promise<void> {
    if (!editingTitle.trim()) {
      setTitleError("O título é obrigatório.")
      return;
    }
    setTitleError("");
    await updateTask(id, editingTitle.trim(), editingDescription.trim(), editingGroup || "");
    cancelEditing();
    loadTasks();
  }

  return (
    <main className="bg-gray-100 min-h-screen flex justify-center items-start p-6">
      <div className="w-full max-w-4xl">
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Lista de Tarefas</h1>
  
          {/* Formulário de criação de tarefa */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="p-2 border rounded w-40 h-10.5"
            >
              <option value="">Grupo</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
                
            <input
              type="text"
              placeholder="Título..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 border rounded w-40"
            />
            {titleError && <p className="text-red-500">{titleError}</p>}

            <input
              type="text"
              placeholder="Descrição..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-grow p-2 border rounded min-w-[200px]"
            />
  
            <button
              onClick={handleCreateTask}
              className="bg-[#3ac47d] text-white p-2 rounded whitespace-nowrap"
            >
              Adicionar
            </button>
          </div>
  
          {/* Formulário de criação de grupo */}
          <div className="flex items-center gap-2 mt-4">
            <input
              type="text"
              placeholder="Novo grupo..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="flex-grow p-2 border rounded"
            />
            <button
              onClick={handleCreateGroup}
              className="p-2 bg-[#2ecc71] text-white rounded"
            >
              Criar grupo
            </button>
          </div>
        </div>
  
        {/* Lista de tarefas */}
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-start bg-white p-4 rounded shadow">
              {editingTaskId === task.id ? (
                // Modo de edição
                <div className="flex flex-col flex-grow">
                  <p>Grupo:</p>
                  <select
                    value={editingGroup}
                    onChange={(e) => setEditingGroup(e.target.value)}
                    className="mb-2 p-2 border rounded"
                  >
                    <option value="">Sem grupo</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  <p>Título:</p>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="mb-2 p-2 border rounded"
                  />

                  <p>Descrição:</p>
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
                      className={`cursor-pointer block font-medium ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                      onClick={() => handleToggleTask(task.id, task.completed)}
                    >
                      {task.title}
                    </span>
                    {task.description && (
                      <div>
                        <p className="text-sm text-gray-700">Descrição: {task.description}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Grupo: {task.group?.name || "Nenhum"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => startEditing(task)} 
                      className="text-blue-500"
                    >
                      <FaRegEdit className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task.id)} 
                      className="text-red-500"
                    >
                      <FaRegTrashAlt className="h-6 w-6" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
  
}
