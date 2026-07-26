const { z } = require("zod");

const createBlogSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(300).optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "pending", "published", "rejected", "archived"]).optional(),
  featured: z.boolean().optional(),
  thumbnail: z.object({
    url: z.string().optional(),
    publicId: z.string().optional(),
  }).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});

const updateBlogSchema = createBlogSchema.partial();

module.exports = { createBlogSchema, updateBlogSchema };
