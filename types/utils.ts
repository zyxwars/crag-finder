import { CragPermissions } from "$lib/cragRoles";
import { Comment, Crag, User } from "@prisma/client";

export type CommentWithAuthor = Comment & {
  author: User;
};

export type CragWithPermissions = Crag & {
  permissions?: CragPermissions;
};
