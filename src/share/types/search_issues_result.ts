export default interface SearchIssuesResult {
  total_count: number;
  incomplete_results: boolean;
  items: Item[];
}

interface Item {
  id: number;
  number: number;
  title: string;
  user: User;
  labels: Label[];
  state: string; // TODO: enum
  locked: boolean;
  assignee: null | User;
  assignees: User[];
  milestone: unknown; // TODO
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: null | string;
  pull_request: null | {};
  body: string;
}

interface User {
  login: string;
  id: number;
}

interface Label {
  id: number;
  name: string;
  color: string;
  default: boolean;
}
