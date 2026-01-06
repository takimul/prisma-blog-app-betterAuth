import express from "express";
import { CommentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.USER,UserRole.ADMIN),
    CommentController.createComment
)
router.get(
    "/:commentId",
    // auth(UserRole.USER,UserRole.ADMIN), 
    CommentController.getCommentbyId
)
router.get(
    "/author/:authorId",
    // auth(UserRole.USER,UserRole.ADMIN), 
    CommentController.getCommentbyAuthor
)

export const commentRouter = router;
