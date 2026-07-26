const generateInvoiceNumber = (index) => {
  const year = new Date().getFullYear();
  const num = String(index).padStart(4, "0");
  return `INV-${year}-${num}`;
};

const generateCertificateNumber = (index) => {
  const year = new Date().getFullYear();
  const num = String(index).padStart(4, "0");
  return `CERT-${year}-${num}`;
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const calculatePagination = (page, limit) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;
  return { page: pageNum, limit: limitNum, skip };
};

module.exports = {
  generateInvoiceNumber,
  generateCertificateNumber,
  slugify,
  calculatePagination,
};
