import { PrismaClient } from "@prisma/client";
import {Customer as CustomerInterface} from "../interfaces/customer.interface"

const prisma = new PrismaClient();

export const isCpfTaken = async (cpf: string): Promise<boolean> => {
  const user =  await prisma.customer.findFirst({
    where:{cpf:cpf}
  })
  if(user) return true;
  return false;
};

export const isEmailTaken = async (email: string): Promise<boolean> => {
  const user =  await prisma.customer.findFirst({
    where:{email:email}
  })
  if(user) return true;
  return false;
};

export const addCustomer = (customer: CustomerInterface): void => {
  prisma.customer.create({
    data:{
      "name": customer.name,
      "email": customer.email,
      "password": customer.password,
      "cpf": customer.cpf
    }
  })
};