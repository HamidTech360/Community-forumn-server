export const normalizeGoogleData = async (data: any) => {
  return {
    email: data.email,
    firstName: data.givenName,
    lastName: data.familyName,
    avatar: data.imageUrl || null,
    authProvider: data.googleId && "GOOGLE",
  };
};

export const normalizeFacebookData = async (data: Record<string, any>) => {
  return {
    fullName: data.name,
    authProvider: String(data.graphDomain).toUpperCase(),
    email: data.email,
  };
};
