interface CragRolePermissions {
  [roleName: string]: {
    name?: boolean;
    content?: boolean;
    tags?: boolean;
    postPhotos?: boolean;
    deletePhotos?: boolean;
    deleteComments?: boolean;
  };
}

export const cragRoles: CragRolePermissions = {
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
