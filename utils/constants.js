const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
};

const ENROLLMENT_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
};

const INVOICE_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

const BLOG_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

const PUBLISHED_STATUS = {
  PUBLISHED: "published",
  DRAFT: "draft",
};

module.exports = {
  PAYMENT_STATUS,
  ENROLLMENT_STATUS,
  INVOICE_STATUS,
  BLOG_STATUS,
  STATUS,
  PUBLISHED_STATUS,
};
