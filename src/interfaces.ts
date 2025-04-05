export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  groupId?: string | null;
  group?: {
    id: string;
    name: string;
  } | null;
}