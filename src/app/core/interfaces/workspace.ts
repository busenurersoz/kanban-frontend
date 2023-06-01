import { Project } from './project';
import { User } from './user';

export interface Workspace {
  id: string;
  name: string;
  key: string;
  url?: string;
  openAccess: boolean;
  description: string;
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}
