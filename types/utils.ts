import { CragPermissions } from "$lib/cragRoles";
import { Comment, Crag, Photo, Visit } from "@prisma/client";

// User stripped of private fields
export type PublicUser = {
  id: number;
  name: string;
};

export type Author = PublicUser;

export type CommentWithAuthor = Comment & {
  author: Author;
};

export type CragWithPermissions = Crag & {
  permissions?: CragPermissions;
};

export type VisitWithAuthorPhotos = Visit & {
  author: Author;
  photos: Photo[];
};
