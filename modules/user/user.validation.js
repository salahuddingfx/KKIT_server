const { z } = require("zod");

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  designation: z.string().max(100).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
  }).optional(),
});

const changeRoleSchema = z.object({
  role: z.enum(["super_admin", "admin", "ceo", "md", "finance", "mentor", "trainer", "support", "user"]),
});

module.exports = { updateUserSchema, changeRoleSchema };
