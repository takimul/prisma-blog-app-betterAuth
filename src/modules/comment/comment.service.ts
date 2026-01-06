import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }
  const result = await prisma.comment.create({
    data: payload,
  });
  return result;
};

const getCommentbyId = async (commentId:string)=> {
    
   return await prisma.comment.findUnique({
        where:{
            id: commentId
        },
        include:{
            replies: true,
            post:{
                select:{
                id:true,
                title: true
                }
            },
            _count:{
                select:{
                    replies:true
                }
            }
        },
        
    })

}

const getCommentbyAuthor = async (authorId:string)=>{
    return await prisma.comment.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt:"desc"
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true
                }
            }
        }
    })
}

export const CommentService = {
  createComment,
  getCommentbyId,
  getCommentbyAuthor
};
