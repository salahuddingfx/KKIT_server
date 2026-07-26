const { z } = require("zod");

const lessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  duration: z.number().min(0).optional(),
  order: z.number().min(0).optional(),
  isFree: z.boolean().optional(),
  resources: z.array(z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    type: z.enum(["pdf", "link", "file"]).optional(),
  })).optional(),
});

const moduleSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().min(0).optional(),
  lessons: z.array(lessonSchema).optional(),
});

const createCourseSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  shortDescription: z.string().max(300).optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  price: z.number().min(0),
  discountPrice: z.number().min(0).optional(),
  modules: z.array(moduleSchema).optional(),
  prerequisites: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
});

const updateCourseSchema = createCourseSchema.partial();

module.exports = { createCourseSchema, updateCourseSchema };
