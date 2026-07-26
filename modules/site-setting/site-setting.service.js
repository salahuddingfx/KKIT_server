const SiteSetting = require("./site-setting.model");

const getAll = async (category) => {
  const filter = {};
  if (category) filter.category = category;
  return SiteSetting.find(filter).sort({ key: 1 });
};

const getByKey = async (key) => {
  return SiteSetting.findOne({ key });
};

const setByKey = async (key, value, type = "string", category = "general", label, description) => {
  return SiteSetting.findOneAndUpdate(
    { key },
    { key, value, type, category, label, description },
    { new: true, upsert: true }
  );
};

const bulkUpdate = async (settings) => {
  const ops = settings.map((s) => ({
    updateOne: {
      filter: { key: s.key },
      update: { $set: s },
      upsert: true,
    },
  }));
  await SiteSetting.bulkWrite(ops);
  return SiteSetting.find().sort({ key: 1 });
};

const deleteKey = async (key) => {
  return SiteSetting.findOneAndDelete({ key });
};

module.exports = { getAll, getByKey, setByKey, bulkUpdate, deleteKey };
