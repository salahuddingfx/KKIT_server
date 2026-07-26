const EmailCampaign = require("./email-campaign.model");
const ApiError = require("../../utils/apiError");
const { paginate } = require("../../utils/pagination");
const { sendEmail } = require("../../services/email/email.service");
const User = require("../user/user.model");
const Enrollment = require("../enrollment/enrollment.model");

const getAllCampaigns = async (query) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  return paginate(EmailCampaign, filter, {
    page: query.page,
    limit: query.limit,
    sort: "-createdAt",
    populate: "createdBy",
  });
};

const getCampaignById = async (id) => {
  const campaign = await EmailCampaign.findById(id).populate("createdBy", "name email").lean();
  if (!campaign) throw ApiError.notFound("Campaign not found");
  return campaign;
};

const createCampaign = async (data, userId) => {
  const campaign = await EmailCampaign.create({ ...data, createdBy: userId });
  return campaign;
};

const updateCampaign = async (id, data) => {
  const campaign = await EmailCampaign.findById(id);
  if (!campaign) throw ApiError.notFound("Campaign not found");
  if (campaign.status === "sent") throw ApiError.badRequest("Cannot edit a sent campaign");

  Object.assign(campaign, data);
  await campaign.save();
  return campaign;
};

const deleteCampaign = async (id) => {
  const campaign = await EmailCampaign.findById(id);
  if (!campaign) throw ApiError.notFound("Campaign not found");
  if (campaign.status === "sending") throw ApiError.badRequest("Cannot delete a campaign while sending");
  await EmailCampaign.findByIdAndDelete(id);
};

const buildTargetQuery = async (campaign) => {
  const { targetAudience, targetFilters } = campaign;
  let userFilter = { isActive: true };

  switch (targetAudience) {
    case "students":
      userFilter.role = "user";
      break;
    case "instructors":
      userFilter.role = { $in: ["mentor", "trainer"] };
      break;
    case "leads": {
      const enrolledUserIds = await Enrollment.distinct("user");
      userFilter._id = { $nin: enrolledUserIds };
      break;
    }
    case "custom":
      if (targetFilters?.role) userFilter.role = targetFilters.role;
      break;
    case "all":
    default:
      break;
  }

  if (targetAudience === "custom" && targetFilters?.course) {
    const enrolledUserIds = await Enrollment.distinct("user", {
      course: targetFilters.course,
    });
    userFilter._id = { $in: enrolledUserIds };
  }

  if (targetFilters?.enrolledAfter || targetFilters?.enrolledBefore) {
    const dateFilter = {};
    if (targetFilters.enrolledAfter) dateFilter.$gte = new Date(targetFilters.enrolledAfter);
    if (targetFilters.enrolledBefore) dateFilter.$lte = new Date(targetFilters.enrolledBefore);

    const enrolledUserIds = await Enrollment.distinct("user", {
      createdAt: dateFilter,
    });
    userFilter._id = userFilter._id
      ? { $in: [...(userFilter._id.$in || []), ...enrolledUserIds] }
      : { $in: enrolledUserIds };
  }

  return userFilter;
};

const sendCampaign = async (id) => {
  const campaign = await EmailCampaign.findById(id);
  if (!campaign) throw ApiError.notFound("Campaign not found");
  if (campaign.status === "sent") throw ApiError.badRequest("Campaign already sent");
  if (campaign.status === "sending") throw ApiError.badRequest("Campaign is currently being sent");

  campaign.status = "sending";
  await campaign.save();

  try {
    const userFilter = await buildTargetQuery(campaign);
    const users = await User.find(userFilter).select("name email").lean();

    if (users.length === 0) {
      campaign.status = "failed";
      await campaign.save();
      throw ApiError.badRequest("No target users found for this campaign");
    }

    let sentCount = 0;
    const sendPromises = users.map(async (user) => {
      try {
        await sendEmail({
          to: user.email,
          subject: campaign.subject,
          template: campaign.template === "custom" ? "newsletter" : campaign.template,
          data: {
            name: user.name,
            content: campaign.content,
            campaignName: campaign.name,
          },
        });
        sentCount++;
      } catch {
        // skip failed individual sends
      }
    });

    await Promise.allSettled(sendPromises);

    campaign.totalSent = sentCount;
    campaign.status = sentCount > 0 ? "sent" : "failed";
    campaign.sentAt = new Date();
    await campaign.save();

    return campaign;
  } catch (error) {
    campaign.status = "failed";
    await campaign.save();
    throw error;
  }
};

const getCampaignStats = async (id) => {
  const campaign = await EmailCampaign.findById(id).lean();
  if (!campaign) throw ApiError.notFound("Campaign not found");

  return {
    name: campaign.name,
    status: campaign.status,
    totalSent: campaign.totalSent,
    totalOpened: campaign.totalOpened,
    totalClicked: campaign.totalClicked,
    openRate: campaign.totalSent > 0 ? ((campaign.totalOpened / campaign.totalSent) * 100).toFixed(2) + "%" : "0%",
    clickRate: campaign.totalSent > 0 ? ((campaign.totalClicked / campaign.totalSent) * 100).toFixed(2) + "%" : "0%",
    sentAt: campaign.sentAt,
    createdAt: campaign.createdAt,
  };
};

module.exports = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  getCampaignStats,
};
