export type User = {
  username: string;
  password: string
  id?: string;
};

export type UserJSON = {
  users: User[];
};