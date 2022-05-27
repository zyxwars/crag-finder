import { Comment, User } from "@prisma/client";

export type CommentWithAuthor = Comment & {
  author?: User;
};
