  export interface Register {
    username: string;
    password: string;
    fullName: string;
    email: string;
    role?: Role; 
  }
  
  export interface Login {
    email: string; 
    password: string;
  }
  
  export type Role = 'DOCTOR' | 'ADMIN';

  export interface Program {
    name: string;
    description?: string;
  }