import { Session } from "next-auth";

export const canDeleteCragChild = (
  session: Session,
  cragId: number,
  child: { cragId: number | null; authorId: number | null },
  permission: boolean
) => {
  const isOwner = child.authorId === session.user.id;

  const hasPermission = permission && child.cragId === cragId;

  return isOwner || hasPermission;
};
