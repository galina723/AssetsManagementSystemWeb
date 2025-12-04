export interface UserModel {
  userID: number;
  email: string;
  fullName: string;
  avatar?: string;
  department: string;
  position: string;
  dateOfBirth: string;
  phone: string;
  gender: string;
  username: string;
  role?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  avatar: string;
  department: string;
  position: string;
  dateOfBirth: string;
}
