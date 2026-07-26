const PageContent = require("./page-content.model");
const ApiError = require("../../utils/apiError");

const getByPage = async (page) => {
  const content = await PageContent.findOne({ page });
  if (!content) return null;
  return content;
};

const getAllPages = async () => {
  return PageContent.find().sort({ page: 1 });
};

const createOrUpdatePage = async (page, data) => {
  return PageContent.findOneAndUpdate({ page }, data, {
    new: true,
    upsert: true,
    runValidators: true,
  });
};

const updateSection = async (page, sectionKey, sectionData) => {
  const content = await PageContent.findOne({ page });
  if (!content) {
    // Create with this section
    return PageContent.findOneAndUpdate(
      { page },
      { page, sections: [{ key: sectionKey, ...sectionData }] },
      { new: true, upsert: true }
    );
  }

  const sectionIndex = content.sections.findIndex((s) => s.key === sectionKey);
  if (sectionIndex >= 0) {
    content.sections[sectionIndex] = { key: sectionKey, ...sectionData };
  } else {
    content.sections.push({ key: sectionKey, ...sectionData });
  }

  return content.save();
};

const deletePage = async (page) => {
  const result = await PageContent.findOneAndDelete({ page });
  if (!result) throw ApiError.notFound("Page content not found");
  return result;
};

module.exports = { getByPage, getAllPages, createOrUpdatePage, updateSection, deletePage };
