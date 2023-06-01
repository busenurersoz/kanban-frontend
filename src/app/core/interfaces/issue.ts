import { User } from './user';

export type IssueType = 'Story' | 'Task' | 'Bug' | 'Meeting';

export enum IssueStatus {
  BACKLOG = 'Backlog',
  IN_PROGRESS = 'InProgress',
  TEST = 'Test',
  IN_REVIEW = 'InReview',
  DONE = 'Done',
}

export enum WorkspaceStatus {
  MEETING = 'MEETINGS',
  TO_DO = 'TO DO',
  PROGRESS = 'PROGRESS',
  MY_NOTES = 'MY NOTES',
  UP_WORKING_WORKS = 'UP WORKING WORKS',
}

export const IssueStatusDisplay = {
  [IssueStatus.BACKLOG]: 'Backlog',
  [IssueStatus.IN_PROGRESS]: 'In progress',
  [IssueStatus.TEST]: 'Test',
  [IssueStatus.IN_REVIEW]: 'In review',
  [IssueStatus.DONE]: 'Done',
};

export const WorkspaceStatusDisplay = {
  [WorkspaceStatus.MEETING]: 'MEETINGS',
  [WorkspaceStatus.TO_DO]: 'TO DO',
  [WorkspaceStatus.PROGRESS]: 'PROGRESS',
  [WorkspaceStatus.MY_NOTES]: 'MY NOTES',
  [WorkspaceStatus.UP_WORKING_WORKS]: 'UP WORKING WORKS',
};

export enum IssuePriority {
  LOWEST = 'Lowest',
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  HIGHEST = 'Highest',
}
export interface Issue {
  id: string;
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  key: number;
  listPosition: number;
  description: Object;
  createdAt: string;
  deadline: string;
  updatedAt: string;
  reporter: User;
  assignees: User[];
  projectId: string;
  projectKey: string;
}
