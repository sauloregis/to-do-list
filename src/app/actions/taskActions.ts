"use server";
import prisma from "@/lib/prisma";

export async function getTasks() {
  return await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createTask(title: string, description?: string) {
  return await prisma.task.create({ data: { title, description } });
}

export async function toggleTask(id: string, completed: boolean) {
  return await prisma.task.update({ where: { id }, data: { completed } });
}

export async function deleteTask(id: string) {
  return await prisma.task.delete({ where: { id } });
}