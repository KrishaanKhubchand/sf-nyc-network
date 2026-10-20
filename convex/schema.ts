import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  hearts: defineTable({ handle: v.string(), addedAt: v.number(), note: v.optional(v.string()) }).index("by_handle", ["handle"]),
});
