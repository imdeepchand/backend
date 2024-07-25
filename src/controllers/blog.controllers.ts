import { blogCollection } from "../collections/blog.collection";
import { AppError, IReqestBody } from "../types/type";
import { Request, Response } from "express";
import z from "zod";
import { ServerErrorsCodes, SuccessCodes } from "../types/httpcodes";
import { HandleAllErrors } from "../helpers/error.helper";
import { ObjectId } from "mongodb";
class BlogController {
    static async createBlog(req: Request, res: Response) {
        try {
            const body = z.object({
                description: z.string().min(10).max(500),
                title: z.string().min(5).max(100),
                postTime: z.date().default(new Date()),
                imageLink: z.string(),
                isLocked: z.boolean().default(false)
            }).parse(req.body);
            const insert = await blogCollection()?.insertOne(body)
            res.status(SuccessCodes.Ok).json({
                message: 'Logged in success!',
                data: insert
            });
        } catch (error) {
            HandleAllErrors(error, { res })
        }
    }

    // Implement a locking mechanism using a timestamp or a similar method to handle concurrency when editing a blog.
    // i am solving this issue by storing the user data and give then expiration time
    // when other user comes to edit same blog, i am checking the bold islocked or not if its locked i am sending the message in response
    static async setLock(req: any, res: Response) {
        try {
            const query = z.object({
                postId: z.string()
            }).parse(req.query);
            const { _id } = (req as any).auth;
            const blog = await blogCollection()?.findOne({ _id: new ObjectId(query.postId) });
            if (!blog) throw new AppError("Not Found!", ServerErrorsCodes.InternalServerError)
            const lockDuration = 15 * 60 * 1000; // 15 minutes
            const currentTime = new Date().getTime();
            const lockExpirationTime = new Date(blog.lockedAt?? '').getTime() + lockDuration;
            if (blog.isLocked) {
                if (lockExpirationTime > currentTime && blog.lockedBy !== req.auth._id) {
                    return res.status(403).send('Blog is locked by another user');
                }
            } else {
                await blogCollection()?.updateOne({ _id: new ObjectId(query.postId) }, {
                    $set: {
                        lockedBy: _id,
                        isLocked: true,
                        lockedAt: new Date(lockExpirationTime)
                    }
                })
                res.status(SuccessCodes.Ok).json({
                    message: "successful!"
                })
            }
        } catch (error) {
            HandleAllErrors(error, { res })
        }
    }
    static async editBlog(req: Request, res: Response) {
        try {
            const body = z.object({
                description: z.string().min(10).max(500),
                title: z.string().min(5).max(100),
                postTime: z.date().default(new Date()),
                imageLink: z.string(),
                isLocked: z.boolean().default(false),
                postId: z.string().optional(), // Optional postId for editing
            }).parse(req.body);

            let insert;
            if (body.postId) {
                // Edit existing blog post
                const postId = new ObjectId(body.postId);
                delete body.postId; // Remove postId from body since we don't want to update it
                insert = await blogCollection()?.updateOne(
                    { _id: postId },
                    {
                        $set: { ...body, isLocked: false }, $unset: {
                            lockedBy: '',
                            lockedAt: ''
                        }
                    }
                );
            } else {
                // Create new blog post
                insert = await blogCollection()?.insertOne(body);
            }

            res.status(SuccessCodes.Ok).json({
                message: 'Blog operation successful!',
                data: insert,
            });
        } catch (error) {
            HandleAllErrors(error, { res })
        }
    }
    static async listBlog(req: Request, res: Response) {
        try {
            const list = await blogCollection()?.find({}).toArray()
            if (!list) throw new AppError("Not Found!", ServerErrorsCodes.InternalServerError)
            res.status(SuccessCodes.Ok).json({
                message: 'successfully list blog!',
                data: list,
            });
        } catch (error) {
            HandleAllErrors(error, { res })
        }
    }
    static async blogById(req: Request, res: Response) {
        try {
            const query = z.object({
                postId: z.string()
            }).parse(req.query);
            const post = await blogCollection()?.findOne({ _id: new ObjectId(query.postId) })
            if (!post) throw new AppError("Not Found!", ServerErrorsCodes.InternalServerError)
            res.status(SuccessCodes.Ok).json({
                message: 'successful!',
                data: post,
            });
        } catch (error) {

        }
    }
}

export default BlogController;
