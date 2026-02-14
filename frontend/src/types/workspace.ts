export type WorkspaceType =
  | "personal"
  | "team"
  | "startup"
  | "enterprise"
  | string; // Allow string to support other types if needed

export interface Workspace {
  _id: string;
  name: string;
  type: WorkspaceType;
  owner: string; // user id of the workspace owner
  members?: Array<{ userId: string; role: string; _id?: string }>;
  channels?: number;
}
