"use server";
import prisma from "@/lib/prisma";
import { Task } from "../../interfaces";

export async function getTasks(): Promise<Task[]> {
  return await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createTask(title: string, description?: string): Promise<Task> {
  return await prisma.task.create({ data: { title, description: description || null } });
}

export async function toggleTask(id: string, completed: boolean): Promise<Task> {
  return await prisma.task.update({ where: { id }, data: { completed } });
}

export async function deleteTask(id: string): Promise<Task> {
  return await prisma.task.delete({ where: { id } });
}

export async function updateTask(id: string, title: string, description: string): Promise<Task> {
  return await prisma.task.update({ where: { id }, 
                                    data: {title, description},
                                  });
}