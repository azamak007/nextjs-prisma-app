import { type NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const searchParam = req.nextUrl.searchParams;
  const search = searchParam.get('search') || '';
  const category = searchParam.get('category');
  const sort = searchParam.get('sort') || 'desc';

  const whereCond = category 
  ? {
      category, 
      title: {
        contains: search,
        mode: 'insensitive'
      }
    }
  : {
      title: {
        contains: search,
        mode: 'insensitive'
      }
    }

  console.log({
    search,
    category,
    sort
  })
  const posts = await prisma.post.findMany({
    where: whereCond as any,
    orderBy: {
      createdAt: sort
    } as any
  });
  return Response.json(posts)
}

export async function POST(req: Request) {
  try {
    const { title, content, category } = await req.json();
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        category
      } 
    });
    return Response.json(newPost)
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500
    })
  }
}