export type WorkspaceType =
  | "personal"
  | "team"
  | "startup"
  | "enterprise";

export interface Workspace {
  _id: string;
  name: string;
  type: WorkspaceType;
  role: "admin" | "member";
}
