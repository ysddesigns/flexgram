export interface User {
  id: string; // Document ID
  email: string;
  name: string;
  deletedFromChat?: boolean; // Optional
}
