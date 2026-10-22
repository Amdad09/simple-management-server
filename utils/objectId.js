import { ObjectId } from "mongodb";

export const toObejctId = (id) => {
    if (!ObjectId.isValid(id) || typeof id !== 'string') return null;
    return new ObjectId(id);
};