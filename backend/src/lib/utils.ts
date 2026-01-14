// eslint-disable @typescript-eslint/no-explicit-any
export function transformDoc(doc: any, ret: any): any {
  ret.id = ret._id; // Create id
  delete ret._id; // Delete _id
  delete ret.__v; // Delete version key
  return ret;
}
