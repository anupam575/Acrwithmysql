export const formatUser = (user) => {
  if (!user) return null;

  return {
    id: user._id,

    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,

    phoneNumber: user.phoneNumber,
    email: user.email,

    isActive: user.isActive,
    profilePic: user.profilePic,
    empCode: user.empCode,

    role: user.role
      ? {
          id: user.role._id || user.role,
          name: user.role.role_name || null,
          key: user.role.role_key || null,
        }
      : null,

    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};