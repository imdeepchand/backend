import z from "zod";
import {Collection, ObjectId} from "mongodb";
import { App } from "../app";

export const UserEntitySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    createdAt: z.date()
})

export type UserEntitySchema = z.infer<typeof UserEntitySchema>;
let collection:Collection<UserEntitySchema>|undefined
export const UserCollection = () => {
    if(!collection) {
        collection = App.mongodb?.collection<UserEntitySchema>("Users")
        return collection
    } else {
        return collection
    }
}