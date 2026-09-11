import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Community } from "./types";

type Draft = {
  open: boolean;
  body: string;
  parentId: string | null;
  quoteId: string | null;
  communityId: string | null;
  replyTo?: { handle: string; body: string };
};

const EMPTY: Draft = {
  open: false,
  body: "",
  parentId: null,
  quoteId: null,
  communityId: null,
};

type ComposeApi = Draft & {
  communities: Community[];
  setCommunities: (c: Community[]) => void;
  setBody: (v: string) => void;
  openCompose: (opts?: Partial<Draft>) => void;
  close: () => void;
};

const Ctx = createContext<ComposeApi | null>(null);

export function ComposeProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [communities, setCommunities] = useState<Community[]>([]);
  const api = useMemo<ComposeApi>(
    () => ({
      ...draft,
      communities,
      setCommunities,
      setBody: (body) => setDraft((d) => ({ ...d, body })),
      openCompose: (opts) =>
        setDraft({
          ...EMPTY,
          open: true,
          ...opts,
          body: opts?.body ?? "",
        }),
      close: () => setDraft(EMPTY),
    }),
    [draft, communities],
  );
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCompose() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ComposeProvider missing");
  return ctx;
}
