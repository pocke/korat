import User from './User';

export default interface SearchIssuesResult {
  total_count: number;
  incomplete_results: boolean;
  items: Item[];
}

export interface Item {
  id: number;
  number: number;
  title: string;
  user: User;
  repo: {
    owner: string;
    name: string;
  };
  labels: Label[];
  state: string; // TODO: enum
  locked: boolean;
  assignee: null | User;
  assignees: User[];
  milestone?: Milestone;
  comments: number;
  created_at: Date;
  updated_at: Date;
  closed_at?: Date;
  pull_request: null | {};
  body: string;
}

interface Label {
  id: number;
  name: string;
  color: string;
  default: boolean;
}

export interface Milestone {
  id: number;
  number: number;
  title: string;
  description: string;
  state: string; // TODO: enum
  created_at: Date;
  updated_at: Date;
  closed_at?: Date;
}
