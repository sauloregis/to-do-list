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
  const [createTitleError, setCreateTitleError] = useState("");
  const [editTitleError, setEditTitleError] = useState("");
  const [activeTab, setActiveTab] = useState<'task' | 'category'>('task');

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
    if (!title.trim()) {
      setCreateTitleError("O título é obrigatório.");
      return;
    }
    
    setCreateTitleError("");
    try {
      await createTask(title.trim(), description.trim() || "", group);
      setTitle("");
      setDescription("");
      setGroup("");
      loadTasks();
    } catch (error: any) {
      if (error.message.includes("Já existe uma tarefa com esse título.")) {
        setCreateTitleError(error.message);
      } else {
        console.error(error);
      }
    }
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

  function cancelEditing(): void {
    setEditingTaskId(null);
    setEditingTitle("");
    setEditingDescription("");
  }

  async function handleUpdateTask(id: string): Promise<void> {
    if (!editingTitle.trim()) {
      setEditTitleError("O título é obrigatório.")
      return;
    }
    try{
      setEditTitleError("");
      await updateTask(id, editingTitle.trim(), editingDescription.trim(), editingGroup || "");
      cancelEditing();
      loadTasks();
    } catch (error: any) {
      if (error.message.includes("Já existe uma tarefa com esse título.")) {
        setEditTitleError(error.message);
      } else {
        console.error(error);
      }
    }
  }

  return (
    <main className="bg-[#e6ebf1] min-h-screen flex justify-center items-start p-6">
      <div className="w-full max-w-4xl">

        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4 text-black">Lista de Tarefas</h1>
          
          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => {
                setActiveTab('task');
                setCreateTitleError('');
              }}
              className={`py-2 px-4 font-medium ${activeTab === 'task'
                ? 'border-b-2 border-[#063970] text-[#063970]'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Adicionar Tarefa
            </button>
            <button
              onClick={() => {
                setActiveTab('category');
                setCreateTitleError('');
              }}
              className={`py-2 px-4 font-medium ${activeTab === 'category'
                ? 'border-b-2 border-[#935139] text-[#935139]'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Criar Categoria
            </button>
          </div>

          {/* Erros */}      
          {createTitleError && (
            <div>
              <p className="text-sm mb-1 text-red-500">
                {createTitleError}
              </p>
            </div>
          )}

          {/* Tab Content */}
          <div className="mt-4">
            {/* Task Creation Form */}
            {activeTab === 'task' && (
              <div className="flex flex-wrap gap-2 items-center text-black">

                <div className="flex flex-col w-40">
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="p-2 border rounded w-40 h-10.5"
                  >
                    <option value="">Categoria</option>
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>  
                
                <div className="flex flex-col w-40">
                  <input
                    type="text"
                    placeholder="Título..."
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setCreateTitleError('');
                    }} 
                    className={`p-2 border rounded ${createTitleError ? 'border-red-500' : ''}`}
                  />
                </div>

                <div className="flex flex-col flex-grow min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Descrição..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-2 border rounded"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={handleCreateTask}
                    className="bg-[#063970] hover:bg-[#053365] text-white p-2 rounded whitespace-nowrap"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            )}
            
            {/* Category Creation Form */}
            {activeTab === 'category' && (
              <div className="flex items-center gap-2 text-black">
                <input
                  type="text"
                  placeholder="Nova Categoria..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="p-2 border rounded h-[42px] flex-grow min-w-0"
                />
                <button
                  onClick={handleCreateGroup}
                  className="h-[42px] px-4 bg-[#935139] hover:bg-[#873e23] text-white rounded whitespace-nowrap"
                >
                  Criar Categoria
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Lista de tarefas */}
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-start bg-white p-4 rounded shadow">
              {editingTaskId === task.id ? (
                 // Modo de edição 
                <div className="flex flex-col flex-grow text-black">
                  <p>Categoria:</p>
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

                  {/* Erros */}      
                  {editTitleError && (
                    <div>
                      <p className="text-sm mb-1 text-red-500">
                        {editTitleError}
                      </p>
                    </div>
                  )}

                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => {
                      setEditingTitle(e.target.value);
                      setEditTitleError('');
                    }}
                    className={`mb-2 p-2 border rounded ${editTitleError ? 'border-red-500' : ''}`}
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
                      className="p-2 bg-[#365f8d] text-white rounded"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-2 bg-gray-400 text-white rounded"
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
                      className={`cursor-pointer block font-medium text-black ${
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
                      Categoria: {task.group?.name || "Nenhum"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(task)}
                      className="text-[#4f739b]"
                    >
                      <FaRegEdit className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-400"
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
