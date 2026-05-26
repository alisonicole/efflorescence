"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { FullPictureItem } from "@/types";

export default function FullPicture() {
  const [items, setItems] = useState<FullPictureItem[]>([]);
  const [goodText, setGoodText] = useState("");
  const [trueText, setTrueText] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) return;
    const query = new Parse.Query("FullPictureItem");
    query.equalTo("user", user);
    query.ascending("createdAt");
    const results = await query.find();
    setItems(
      results.map((r) => ({
        objectId: r.id,
        side: r.get("side") as "good" | "true",
        text: r.get("text") as string,
        createdAt: r.createdAt!,
      })),
    );
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addItem(side: "good" | "true", text: string) {
    const trimmed = text.trim();
    if (!trimmed || adding) return;
    setAdding(true);
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setAdding(false);
      return;
    }
    const ParseItem = Parse.Object.extend("FullPictureItem");
    const item = new ParseItem();
    item.set("user", user);
    item.set("side", side);
    item.set("text", trimmed);
    item.setACL(new Parse.ACL(user));
    await item.save();
    if (side === "good") setGoodText("");
    else setTrueText("");
    setAdding(false);
    void load();
  }

  const column = (
    side: "good" | "true",
    label: string,
    value: string,
    onChange: (v: string) => void,
  ) => (
    <div className="flex-1">
      <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-2">
        {label}
      </p>
      <ul className="space-y-2 mb-3">
        {items
          .filter((i) => i.side === side)
          .map((i) => (
            <li
              key={i.objectId}
              className="bg-white rounded-card p-3 border border-border"
            >
              <p className="text-xs text-bark">{i.text}</p>
              <p className="font-mono text-[8px] text-muted mt-1">
                {i.createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </li>
          ))}
      </ul>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void addItem(side, value);
          }}
          placeholder="Add something..."
          className="flex-1 bg-white rounded-card px-3 py-2 text-xs text-bark placeholder:text-muted/60 border border-border focus:outline-none focus:border-clay/40"
        />
        <button
          onClick={() => void addItem(side, value)}
          disabled={!value.trim() || adding}
          className="bg-bark text-cream rounded-card px-3 py-2 text-xs disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex gap-3">
      {column("good", "What was genuinely good", goodText, setGoodText)}
      {column("true", "What was actually true", trueText, setTrueText)}
    </div>
  );
}
