import prisma from "./prisma";

export interface CragPermissions {
  name?: boolean;
  content?: boolean;
  tags?: boolean;
  postPhotos?: boolean;
  deletePhotos?: boolean;
  deleteComments?: boolean;
}

interface RolePermissions {
  [roleName: string]: CragPermissions;
}

export const cragRoles: RolePermissions = {
  OWNER: {
    name: true,
    content: true,
    tags: true,
    postPhotos: true,
    deletePhotos: true,
    deleteComments: true,
  },
  MODERATOR: {
    postPhotos: true,
    deletePhotos: true,
    deleteComments: true,
  },
  OBSERVER: {},
};

export const getRole = async (cragId: number, userId: number) => {
  const role = await prisma.cragRole.findFirst({
    where: {
      userId: userId,
      cragId: cragId,
    },
  });

  return role?.role;
};

export const getPermissions = async (cragId: number, userId: number) => {
  const role = await getRole(cragId, userId);

  return cragRoles[role || "OBSERVER"];
};
