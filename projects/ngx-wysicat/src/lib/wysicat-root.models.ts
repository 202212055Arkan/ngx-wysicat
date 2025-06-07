export interface EditorDataModel {
  insert?: string | Record<string, unknown>;
  delete?: number;
  retain?: number | Record<string, unknown>;
  attributes?: {
    [key: string]: unknown;
  };
}
