const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  CEO: "ceo",
  MD: "md",
  FINANCE: "finance",
  MENTOR: "mentor",
  TRAINER: "trainer",
  SUPPORT: "support",
  USER: "user",
};

const ROLE_HIERARCHY = {
  super_admin: 9,
  ceo: 8,
  md: 7,
  admin: 6,
  finance: 5,
  mentor: 4,
  trainer: 3,
  support: 2,
  user: 1,
};

module.exports = { ROLES, ROLE_HIERARCHY };
