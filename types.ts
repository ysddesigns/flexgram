export interface User {
  id: string; // Document ID
  email: string;
  name: string;
  avatar: string;
  deletedFromChat?: boolean; // Optional
}
