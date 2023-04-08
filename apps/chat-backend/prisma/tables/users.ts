interface IUsers {
  id?: string;
  username: string;
  email: string;
  profile_picture?: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

const Users: IUsers[] = [
  {
    username: 'lega',
    email: 'onghinjourn@gmail.com',
    password: '$2a$12$qG7eUNKlbwW1e7nXXuUlYeRTUsA8OsrPyJDZ6TbRT19kmkKYCSpNu'
  }
];

export { Users };
export type { IUsers };
