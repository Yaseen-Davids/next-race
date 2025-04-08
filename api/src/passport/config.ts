export const facebookConfig = {
  clientID: process.env.FACEBOOK_APP_ID || "",
  clientSecret: process.env.FACEBOOK_APP_SECRET || "",
  callbackURL: `${process.env.API_URL}/api/user/login/facebook/callback`,
  enableProof: true,
  profileFields: ["id", "emails", "name"],
};

export const googleConfig = {
  clientID: process.env.GOOGLE_APP_ID || "",
  clientSecret: process.env.GOOGLE_APP_SECRET || "",
  callbackURL: `${process.env.API_URL}/api/user/login/google/callback`,
  enableProof: true,
  profileFields: ["id", "emails", "name"],
};
