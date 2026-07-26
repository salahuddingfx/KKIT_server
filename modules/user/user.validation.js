const { z } = require("zod");

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  designation: z.string().max(100).optional().nullable(),
  address: z
    .union([
      z.string(),
      z.object({
        street: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
        state: z.string().optional().nullable(),
        zipCode: z.string().optional().nullable(),
        country: z.string().optional().nullable(),
      }),
    ])
    .optional()
    .nullable(),
  socialLinks: z
    .object({
      facebook: z.string().optional().nullable(),
      linkedin: z.string().optional().nullable(),
      twitter: z.string().optional().nullable(),
      github: z.string().optional().nullable(),
      website: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

const changeRoleSchema = z.object({
  role: z.enum(["super_admin", "admin", "ceo", "md", "finance", "mentor", "trainer", "support", "user"]),
});

module.exports = { updateUserSchema, changeRoleSchema };
