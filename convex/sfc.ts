import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// SF Coffee List (sf-coffee-list.vercel.app): per-person group + order overrides from drag and drop.
export const list = query({
  args: {},
  handler: async (ctx) =>
    (await ctx.db.query("sfcPlacements").collect()).map((p) => ({ key: p.key, g: p.g, o: p.o })),
});

export const setMany = mutation({
  args: { items: v.array(v.object({ key: v.string(), g: v.string(), o: v.number() })) },
  handler: async (ctx, { items }) => {
    for (const it of items.slice(0, 500)) {
      const ex = await ctx.db.query("sfcPlacements").withIndex("by_key", (q) => q.eq("key", it.key)).first();
      if (ex) await ctx.db.patch(ex._id, { g: it.g, o: it.o, at: Date.now() });
      else await ctx.db.insert("sfcPlacements", { key: it.key, g: it.g, o: it.o, at: Date.now() });
    }
    return items.length;
  },
});
