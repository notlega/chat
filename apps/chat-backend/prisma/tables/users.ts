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
    password: 'a0f2105abc31c0fa588e7afde8907e9990b22d1d769f7ca6b9b94671bbfcf2d8'
  }
];

export { Users };
export type { IUsers };
