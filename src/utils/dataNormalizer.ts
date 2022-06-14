export const normalizeGoogleData = async (data: any) => {
  return {
    email: data.email,
    fullName: data.name,
    picture: data.imageUrl || null,
    authProvider: data.googleId && "GOOGLE",
    role: data.role
  };
};

export const normalizeFacebookData = async (data: Record<string, any>) => {
  return {
    fullName: data.name,
    authProvider: String(data.graphDomain).toUpperCase(),
    email: data.email
  };
};
