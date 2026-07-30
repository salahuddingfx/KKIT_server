const Role = require("./role.model");
const User = require("../user/user.model");
const ApiError = require("../../utils/apiError");
const PERMISSIONS = require("../../config/permissions");

const DEFAULT_PAGES = [
  "/dashboard",
  "/users",
  "/courses",
  "/categories",
  "/partners",
  "/home-stats",
  "/offers",
  "/payments",
  "/revenue-analytics",
  "/enrollments",
  "/submissions",
  "/projects",
  "/learning-paths",
  "/live-classes",
  "/discussions",
  "/content",
  "/blog",
  "/reviews",
  "/notices",
  "/portfolio",
  "/careers",
  "/pricing",
  "/faqs",
  "/team",
  "/services",
  "/testimonials",
  "/contacts",
  "/newsletters",
  "/email-campaigns",
  "/settings",
  "/roles",
];

const SYSTEM_ROLES = [
  {
    name: "Super Admin",
    slug: "super_admin",
    description: "Full system control and access to all features.",
    allowedPages: DEFAULT_PAGES,
    permissions: ["*"],
    isSystem: true,
  },
  {
    name: "Admin",
    slug: "admin",
    description: "Administrative access to manage users, courses, content, and settings.",
    allowedPages: DEFAULT_PAGES,
    permissions: PERMISSIONS.admin || [],
    isSystem: true,
  },
  {
    name: "CEO",
    slug: "ceo",
    description: "Executive access with full administrative privileges.",
    allowedPages: DEFAULT_PAGES,
    permissions: ["*"],
    isSystem: true,
  },
  {
    name: "MD",
    slug: "md",
    description: "Managing Director access with full administrative privileges.",
    allowedPages: DEFAULT_PAGES,
    permissions: ["*"],
    isSystem: true,
  },
  {
    name: "Finance",
    slug: "finance",
    description: "Financial management access for payments, invoices, and revenue reports.",
    allowedPages: ["/dashboard", "/payments", "/revenue-analytics", "/users"],
    permissions: PERMISSIONS.finance || [],
    isSystem: true,
  },
  {
    name: "Mentor",
    slug: "mentor",
    description: "Mentor access to oversee assigned courses, students, and reviews.",
    allowedPages: ["/dashboard", "/courses", "/enrollments", "/reviews", "/discussions", "/live-classes"],
    permissions: PERMISSIONS.mentor || [],
    isSystem: true,
  },
  {
    name: "Trainer",
    slug: "trainer",
    description: "Trainer access for course delivery, lessons, and live classes.",
    allowedPages: ["/dashboard", "/courses", "/enrollments", "/live-classes"],
    permissions: PERMISSIONS.trainer || [],
    isSystem: true,
  },
  {
    name: "Support",
    slug: "support",
    description: "Support staff access for contact submissions, tickets, and FAQs.",
    allowedPages: ["/dashboard", "/users", "/contacts", "/faqs", "/discussions"],
    permissions: PERMISSIONS.support || [],
    isSystem: true,
  },
  {
    name: "User",
    slug: "user",
    description: "Default standard student/user access.",
    allowedPages: [],
    permissions: PERMISSIONS.user || [],
    isSystem: true,
  },
];

const seedSystemRoles = async () => {
  try {
    for (const sysRole of SYSTEM_ROLES) {
      const existing = await Role.findOne({ slug: sysRole.slug });
      if (!existing) {
        await Role.create(sysRole);
      } else {
        let updated = false;
        if (!existing.allowedPages || existing.allowedPages.length === 0) {
          existing.allowedPages = sysRole.allowedPages;
          updated = true;
        }
        if (!existing.permissions || existing.permissions.length === 0) {
          existing.permissions = sysRole.permissions;
          updated = true;
        }
        if (updated) await existing.save();
      }
    }
  } catch (err) {
    console.error("Failed to seed system roles:", err);
  }
};

const getAllRoles = async () => {
  await seedSystemRoles();
  const roles = await Role.find().sort({ isSystem: -1, createdAt: 1 }).lean();

  // Aggregate count of users per role
  const userCounts = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  const countMap = {};
  userCounts.forEach((u) => {
    if (u._id) countMap[u._id] = u.count;
  });

  return roles.map((r) => ({
    ...r,
    userCount: countMap[r.slug] || 0,
  }));
};

const getRoleById = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw ApiError.notFound("Role not found");
  return role;
};

const getRoleBySlug = async (slug) => {
  await seedSystemRoles();
  let role = await Role.findOne({ slug, isActive: true });
  if (!role) {
    // Check fallback system roles
    const sysRole = SYSTEM_ROLES.find((r) => r.slug === slug);
    if (sysRole) return sysRole;
  }
  return role;
};

const createRole = async (data) => {
  const { name, description, allowedPages, permissions } = data;
  if (!name) throw ApiError.badRequest("Role name is required");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  if (!slug) throw ApiError.badRequest("Invalid role name");

  const existing = await Role.findOne({ slug });
  if (existing) throw ApiError.conflict("A role with this name already exists");

  const role = await Role.create({
    name,
    slug,
    description: description || "",
    allowedPages: allowedPages || [],
    permissions: permissions || [],
    isSystem: false,
    isActive: true,
  });

  return role;
};

const updateRole = async (id, data) => {
  const role = await Role.findById(id);
  if (!role) throw ApiError.notFound("Role not found");

  if (data.name && data.name !== role.name && !role.isSystem) {
    role.name = data.name;
  }
  if (data.description !== undefined) role.description = data.description;
  if (data.allowedPages !== undefined) role.allowedPages = data.allowedPages;
  if (data.permissions !== undefined) role.permissions = data.permissions;
  if (data.isActive !== undefined && !role.isSystem) role.isActive = data.isActive;

  await role.save();
  return role;
};

const deleteRole = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw ApiError.notFound("Role not found");
  if (role.isSystem) throw ApiError.badRequest("System roles cannot be deleted");

  const assignedUsers = await User.countDocuments({ role: role.slug });
  if (assignedUsers > 0) {
    throw ApiError.badRequest(
      `Cannot delete role because ${assignedUsers} user(s) are assigned to it.`
    );
  }

  await Role.findByIdAndDelete(id);
  return { message: "Role deleted successfully" };
};

module.exports = {
  seedSystemRoles,
  getAllRoles,
  getRoleById,
  getRoleBySlug,
  createRole,
  updateRole,
  deleteRole,
};
