import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
export const list = query({ args: {}, handler: async (ctx) => (await ctx.db.query("hearts").collect()).map(h => ({ handle: h.handle, addedAt: h.addedAt, note: h.note })) });
export const toggle = mutation({
  args: { handle: v.string() },
  handler: async (ctx, { handle }) => {
    const h = handle.toLowerCase();
    const ex = await ctx.db.query("hearts").withIndex("by_handle", q => q.eq("handle", h)).first();
    if (ex) { await ctx.db.delete(ex._id); return false; }
    await ctx.db.insert("hearts", { handle: h, addedAt: Date.now() }); return true;
  },
});
