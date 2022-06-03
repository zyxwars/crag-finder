import prisma from "./prisma";

export interface CragPermissions {
  name?: boolean;
  body?: boolean;
  tags?: boolean;
  postPhotos?: boolean;
  deletePhotos?: boolean;
  deleteComments?: boolean;
  deleteCrag?: boolean;
}

interface RolePermissions {
  [roleName: string]: CragPermissions | null;
}

export const cragRoles: RolePermissions = {
  OWNER: {
    name: true,
    body: true,
    tags: true,
    postPhotos: true,
    deletePhotos: true,
    deleteComments: true,
    deleteCrag: true,
  },
  MODERATOR: {
    postPhotos: true,
    deletePhotos: true,
    deleteComments: true,
  },
  OBSERVER: null,
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
