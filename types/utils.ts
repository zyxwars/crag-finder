import { CragPermissions } from "$lib/cragRoles";
import { PublicUser } from "$lib/db/selectors";
import { Comment, Crag, Photo, Visit } from "@prisma/client";

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
