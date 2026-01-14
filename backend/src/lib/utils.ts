export function transformDoc(doc, ret) {
  ret.id = ret._id; // Create id
  delete ret._id; // Delete _id
  delete ret.__v; // Delete version key
  return ret;
}
