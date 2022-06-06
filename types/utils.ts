import { CragPermissions } from "$lib/cragRoles";
import { Comment, Crag, Photo, User, Visit } from "@prisma/client";

// User stripped of private fields
export type Author = {
  id: number;
  name: string;
};

export type CommentWithAuthor = Comment & {
  author: User;
};

export type CragWithPermissions = Crag & {
  permissions?: CragPermissions;
};

export type VisitWithAuthorPhotos = Visit & {
  author: Author;
  photos: Photo[];
};
