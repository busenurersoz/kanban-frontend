import { Project } from './project';
import { User } from './user';

export interface Workspace {
  id: string;
  name: string;
  key: string;
  url?: string;
  openAccess: boolean;
  description: {ops:Array<any>};
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}
