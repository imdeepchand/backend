import z from "zod";
import {Collection, ObjectId} from "mongodb";
import { App } from "../app";

export const BlogEntitySchema = z.object({
    description: z.string().min(10).max(500),
    title: z.string().min(5).max(100),
    postTime: z.date(),
    imageLink: z.string(),
    isLocked: z.boolean().default(false),
  lockedBy: z.string().optional(),
  lockedAt: z.date().optional(),
})

export type BlogEntitySchema = z.infer<typeof BlogEntitySchema>;
let collection:Collection<BlogEntitySchema>|undefined
export const blogCollection = () => {
    if(!collection) {
        collection = App.mongodb?.collection<BlogEntitySchema>("Blogs")
        return collection
    } else {
        return collection
    }
}