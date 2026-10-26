import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// SF + NYC network: per-list status (key = "src|city|role"). Missing row = "todo".
const STATUSES = ["todo", "processing", "done", "skipped"];

export const list = query({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query("listStatus").collect()).map((r) => ({ key: r.key, status: r.status, at: r.at })),
});

export const set = mutation({
  args: { key: v.string(), status: v.string() },
  handler: async (ctx, { key, status }) => {
    if (!STATUSES.includes(status)) throw new Error("bad status");
    if (key.length > 80 || key.split("|").length !== 3) throw new Error("bad key");
    const ex = await ctx.db.query("listStatus").withIndex("by_key", (q) => q.eq("key", key)).first();
    if (status === "todo") { if (ex) await ctx.db.delete(ex._id); return status; }
    if (ex) await ctx.db.patch(ex._id, { status, at: Date.now() });
    else await ctx.db.insert("listStatus", { key, status, at: Date.now() });
    return status;
  },
});
