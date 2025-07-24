import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import GardeningPost from "../GardeningPost/GardeningPost.model";
import Contact from "./contact.model";

const createContacIntoDB = async (
  userId: string,
  payload: Record<string, unknown>
) => {
  const newPayload = {
    ...payload,
    user: userId,
  };

  const result = await Contact.create(newPayload);
  return result;
};

export const ContactServices = {
  createContacIntoDB,
};
