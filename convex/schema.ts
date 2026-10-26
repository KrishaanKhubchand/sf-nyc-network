import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  hearts: defineTable({ handle: v.string(), addedAt: v.number(), note: v.optional(v.string()) }).index("by_handle", ["handle"]),
  listStatus: defineTable({ key: v.string(), status: v.string(), at: v.number() }).index("by_key", ["key"]),
  sfcPlacements: defineTable({ key: v.string(), g: v.string(), o: v.number(), at: v.number() }).index("by_key", ["key"]),
});
