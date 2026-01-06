import type { Post, PostStatus } from "../../../generated/prisma/client";
import type { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean |undefined,
  status: PostStatus |undefined,
  authorId: string | undefined,
  page: number, 
  limit: number,
  skip: number,
  sortBy: string ,
  sortOrder:string
}) => {
  const andConditions: PostWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }
  if(tags.length>0){
    andConditions.push({
          tags: {
            hasEvery: tags,
          },
        })
  }
  if (typeof isFeatured === 'boolean'){
    andConditions.push({
        isFeatured
    })
  }
  if(status){
    andConditions.push(
        {
            status
        }
    )
  }
  if(authorId){
    andConditions.push(
        {
            authorId
        }
    )
  }
  const allPost = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include:{
          _count:{
            select:{
              comments:true
            }
          }
        }
    });
    const total = await prisma.post.count(
      {
        where: {
            AND: andConditions
        } 
      }
    )
  return {
    data:allPost,
    pagination: {
      total,
      page,
      limit,
      totalpages: Math.ceil(total/limit)
    }
  };
};


const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

// const getPostById = async(postId: string) =>{
//   const result = await prisma.$transaction( async(tx)=>{
//    await tx.post.update({
//     where:{
//       id: postId
//     },
//     data:{
//       views:{
//         increment: 1
//       }
//     }
//   });
//     const postData= await tx.post.findUnique(
//     {
//       where:{
//         id: postId
//       }
//     }
//   )
//   return postData;
//   })
//   return result;
// }
const getPostById = async (postId: string) => {
  
  await prisma.post.updateMany({
    where: { id: postId },
    data: {
      views: { increment: 1 },
    },
  });

  
  const postData = await prisma.post.findUnique({
    where: { id: postId },
    include:{
      comments: {
        where:{
          parentId: null
        },
        orderBy:{
          createdAt: "desc"
        },
        include:{
          replies: {
            orderBy:{
              createdAt:"asc"
            },
            include:{
              replies: 
              {orderBy:{
              createdAt:"asc"}
            },
            }
          }
        }
      },
      _count:{
        select:{comments:true}
      }
    }
  });

  return postData;
};


export const PostService = {
  createPost,
  getAllPost,
  getPostById
};
