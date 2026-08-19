import { useCallback, useEffect, useState } from "react";

const KEY = "wildcape.saved";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function useSaved() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(read());
    const onStorage = () => setSaved(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("wildcape-saved", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("wildcape-saved", onStorage);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("wildcape-saved"));
    return next.includes(slug);
  }, []);

  return { saved, toggle, isSaved: (slug: string) => saved.includes(slug) };
}
