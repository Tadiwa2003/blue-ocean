import Service from '../models/Service.js';

export const getAllServices = async (userId = null, isOwner = false, storefrontId = undefined) => {
  // Build query based on filters
  const query = {};
  
  // If storefrontId is explicitly provided (not undefined), filter by it
  // undefined = don't filter by storefront (show all)
  // null = show only platform services (storefrontId is null)
  // ObjectId = show only services for that storefront
  if (storefrontId !== undefined) {
    query.storefrontId = storefrontId;
  }
  
  // If userId is provided and user is not owner, ONLY show services with that userId
  // This excludes platform services (without userId) from user dashboards
  // Owners see all services (including platform services without userId)
  if (userId && !isOwner) {
    query.userId = userId;
  }
  
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
