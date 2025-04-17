"use server";
import prisma from "@/lib/prisma";
import { Task } from "../../interfaces";

export async function getTasks(): Promise<Task[]> {
  return await prisma.task.findMany({ 
    orderBy: { createdAt: "desc"},
    include: { group: true},  
  });
}

export async function createTask(title: string, description?: string, groupId?: string): Promise<Task> {
  try {
    return await prisma.task.create({ data: { title, description: description || null, ...(groupId ? {group: { connect: { id: groupId } } } : {}), }, });
    } catch (error:any) {
    console.error("Erro ao criar tarefa:", error);
    if(error.code === "P2002") {
      throw new Error ("Já existe uma tarefa com esse título.");
    }
    throw new Error ("Erro ao criar tarefa.");
  }
}

export async function toggleTask(id: string, completed: boolean): Promise<Task> {
  try {
    return await prisma.task.update({ where: { id }, data: { completed } });
  } catch (error: any) {
    console.error("Erro ao atualizar status da tarefa:", error);
    if (error.code === "P2025") {
      throw new Error ("Tarefa não encontrada.");
    }
    throw new Error ("Erro ao atualizar status da tarefa.");
  }
}

export async function deleteTask(id: string): Promise<Task> {
  try {
    return await prisma.task.delete({ where: { id } });
  } catch (error: any) {
    console.error("Erro ao excluir tarefa:", error);
    if (error.code === "P2025") {
      throw new Error ("Tarefa não encontrada.");
    }
    throw new Error ("Erro ao excluir tarefa.");
  }
}

export async function updateTask(id: string, title: string, description: string, groupId?: string): Promise<Task> {
  try {
    return await prisma.task.update({ where: { id }, 
                                      data: {title, 
                                            description, 
                                            group: groupId ? { connect: { id: groupId } } : { disconnect: true },},
                                    });
    } catch (error:any) {
      console.error("Erro ao editar tarefa:", error);
      if(error.code === "P2002") {
        throw new Error ("Já existe uma tarefa com esse título.");
      }
      if(error.code === "P2025") {
        throw new Error ("Tarefa não encontrada.");
      }
      throw new Error ("Erro ao atualizar tarefa.");
  }
}

export async function getGroups() {
  try {
    return await prisma.group.findMany({ orderBy: { name: "asc" } });
  } catch (error: any) {
    console.error("Erro ao buscar categorias:", error);
    throw new Error ("Erro ao buscar categorias.");
  }
}

export async function createGroup(name: string) {
  try {
    return await prisma.group.create({ data: { name } });
  } catch (error: any) {
    console.error("Erro ao criar categoria:", error);
    if (error.code === "P2002") {
      throw new Error ("Já existe uma categoria com esse nome.");
    }
    throw new Error ("Erro ao criar categoria.");
  }
}