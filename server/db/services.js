import Service from '../models/Service.js';

export const getAllServices = async (userId = null, isOwner = false) => {
  // If userId is provided and user is not owner, ONLY show services with that userId
  // This excludes platform services (without userId) from user dashboards
  // Owners see all services (including platform services without userId)
  const query = userId && !isOwner ? { userId } : {};
  return await Service.find(query).sort({ createdAt: -1 }).lean();
};

export const getServiceById = async (id) => {
  return await Service.findOne({ id }).lean();
};

export const createService = async (serviceData) => {
  const service = await Service.create(serviceData);
  return service.toObject();
};

export const updateService = async (id, updateData) => {
  const service = await Service.findOneAndUpdate(
    { id },
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean();
  return service;
};

export const deleteService = async (id) => {
  const result = await Service.findOneAndDelete({ id });
  return result ? result.toObject() : null;
};
