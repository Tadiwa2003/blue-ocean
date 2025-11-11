import Product from '../models/Product.js';

export const getAllProducts = async (userId = null, isOwner = false) => {
  // If userId is provided and user is not owner, ONLY show products with that userId
  // This excludes platform products (without userId) from user dashboards
  // Owners see all products (including platform products without userId)
  const query = userId && !isOwner ? { userId } : {};
  return await Product.find(query).sort({ createdAt: -1 }).lean();
};

export const getProductById = async (id) => {
  return await Product.findOne({ id }).lean();
};

export const getProductBySlug = async (slug) => {
  return await Product.findOne({ slug }).lean();
};

export const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product.toObject();
};

export const updateProduct = async (id, updateData) => {
  const product = await Product.findOneAndUpdate(
    { id },
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).lean();
  return product;
};

export const deleteProduct = async (id) => {
  const result = await Product.findOneAndDelete({ id });
  return result ? result.toObject() : null;
};
