export const generateUniqueSlug = async (model: any, baseSlug: string, id?: string) => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await model.findOne({ slug });

    if (!existing || existing._id.toString() === id) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};