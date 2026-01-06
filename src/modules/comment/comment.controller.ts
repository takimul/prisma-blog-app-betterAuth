import type { Request, Response } from "express";
import { CommentService } from "./comment.service";

const getCommentbyId = async (req: Request, res: Response) => {
  try {
    const {commentId} = req.params;
    const result = await CommentService.getCommentbyId(commentId as string);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Commnet get by id failed",
      details: e,
    });
  }
};
const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await CommentService.createComment(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Commnet creation failed",
      details: e,
    });
  }
};

const getCommentbyAuthor = async(req: Request, res: Response)=>{
     try {
    const {authorId} = req.params;
    const result = await CommentService.getCommentbyAuthor(authorId as string);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Commnet get by id failed",
      details: e,
    });
  }
}

export const CommentController ={
    createComment,
    getCommentbyId,
    getCommentbyAuthor
}
