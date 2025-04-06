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
  return await prisma.task.update({ where: { id }, data: { completed } });
}

export async function deleteTask(id: string): Promise<Task> {
  return await prisma.task.delete({ where: { id } });
}

export async function updateTask(id: string, title: string, description: string, groupId?: string): Promise<Task> {
  return await prisma.task.update({ where: { id }, 
                                    data: {title, 
                                          description, 
                                          group: groupId ? { connect: { id: groupId } } : { disconnect: true },},
                                  });
}

export async function getGroups() {
  return await prisma.group.findMany({ orderBy: { name: "asc" } });
}

export async function createGroup(name: string) {
  return await prisma.group.create({ data: { name } });
}