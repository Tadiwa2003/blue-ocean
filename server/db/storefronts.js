import Storefront from '../models/Storefront.js';

export async function getUserStorefronts(userId) {
  try {
    return await Storefront.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error fetching user storefronts:', error);
    throw error;
  }
}

export async function getStorefrontById(storefrontId) {
  try {
    return await Storefront.findById(storefrontId);
  } catch (error) {
    console.error('Error fetching storefront:', error);
    throw error;
  }
}

export async function getStorefrontBySlug(slug) {
  try {
    return await Storefront.findOne({ slug, isPublished: true });
  } catch (error) {
    console.error('Error fetching storefront by slug:', error);
    throw error;
  }
}

export async function createStorefront(storefrontData) {
  try {
    const storefront = new Storefront(storefrontData);
    return await storefront.save();
  } catch (error) {
    console.error('Error creating storefront:', error);
    throw error;
  }
}

export async function updateStorefront(storefrontId, userId, updateData) {
  try {
    const storefront = await Storefront.findOneAndUpdate(
      { _id: storefrontId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!storefront) {
      throw new Error('Storefront not found or access denied');
    }
    return storefront;
  } catch (error) {
    console.error('Error updating storefront:', error);
    throw error;
  }
}

export async function deleteStorefront(storefrontId, userId) {
  try {
    const result = await Storefront.findOneAndDelete({ _id: storefrontId, userId });
    if (!result) {
      throw new Error('Storefront not found or access denied');
    }
    return result;
  } catch (error) {
    console.error('Error deleting storefront:', error);
    throw error;
  }
}

export async function publishStorefront(storefrontId, userId) {
  try {
    return await updateStorefront(storefrontId, userId, {
      isPublished: true,
      publishedAt: new Date(),
    });
  } catch (error) {
    console.error('Error publishing storefront:', error);
    throw error;
  }
}

export async function unpublishStorefront(storefrontId, userId) {
  try {
    return await updateStorefront(storefrontId, userId, {
      isPublished: false,
    });
  } catch (error) {
    console.error('Error unpublishing storefront:', error);
    throw error;
  }
}

