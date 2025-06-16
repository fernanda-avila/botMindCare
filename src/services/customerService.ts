// src/services/customerService.ts
interface Customer {
  name: string;
  username: string;
  email: string;
  cpf: string;
}

const database: Customer[] = [
  { name: 'João', username: 'joao123', email: 'joao@email.com', cpf: '12345678900' }
];

export const isUsernameTaken = async (username: string): Promise<boolean> => {
  return database.some(user => user.username === username);
};

export const isEmailTaken = async (email: string): Promise<boolean> => {
  return database.some(user => user.email === email);
};

export const isCpfTaken = async (cpf: string): Promise<boolean> => {
  return database.some(user => user.cpf === cpf);
};

export const addCustomer = (customer: Customer): void => {
  database.push(customer);
};

export const getAllCustomers = (): Customer[] => [...database];
