export const data: Owner[] = [
  {
    id: 1,
    username: 'bhowner_maria',
    firstname: 'Maria',
    lastname: 'Santos',
    email: 'maria.santos@example.com',
    password: 'hashed_password_1',
    role: 'OWNER',
    isActive: true,
    isVerified: true,
    createdAt: '2024-01-15T08:25:00.000Z',
    updatedAt: '2024-06-10T12:40:00.000Z',
    age: 42,
    address: '123 P. Burgos St., Quezon City',
    phone_number: '09171234567',
    isDeleted: false,
    deletedAt: null,
  },
  {
    id: 2,
    username: 'joel_bh',
    firstname: 'Joel',
    lastname: 'Cruz',
    email: 'joel.cruz@example.com',
    password: 'hashed_password_2',
    role: 'OWNER',
    isActive: true,
    isVerified: false,
    createdAt: '2024-03-02T10:15:00.000Z',
    updatedAt: '2024-06-20T09:10:00.000Z',
    age: 35,
    address: '456 Mabini St., Manila',
    phone_number: '09281234567',
    isDeleted: false,
    deletedAt: null,
  },
  {
    id: 3,
    username: 'rosario_bh',
    firstname: 'Rosario',
    lastname: 'Dela Cruz',
    email: 'rosario.delacruz@example.com',
    password: 'hashed_password_3',
    role: 'OWNER',
    isActive: false,
    isVerified: false,
    createdAt: '2024-04-05T14:50:00.000Z',
    updatedAt: '2024-07-01T17:25:00.000Z',
    age: 50,
    address: '789 Bonifacio Ave., Davao City',
    phone_number: '09391234567',
    isDeleted: false,
    deletedAt: null,
  },
  {
    id: 4,
    username: 'alvin_boarding',
    firstname: 'Alvin',
    lastname: 'Reyes',
    email: 'alvin.reyes@example.com',
    password: 'hashed_password_4',
    role: 'OWNER',
    isActive: true,
    isVerified: true,
    createdAt: '2024-05-12T11:05:00.000Z',
    updatedAt: '2024-07-18T16:30:00.000Z',
    age: 29,
    address: '101 Rizal St., Cebu City',
    phone_number: '09181239876',
    isDeleted: false,
    deletedAt: null,
  },
];

export interface Owner {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'OWNER' | 'ADMIN' | 'TENANT'; // or just string if more roles exist
  isActive: boolean;
  isVerified: boolean;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date
  age: number;
  address: string;
  phone_number: string;
  isDeleted: boolean;
  deletedAt: string | null;
}
