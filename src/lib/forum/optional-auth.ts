import { createMiddleware } from "@tanstack/react-start";

/**
 * Forwards the live-preview bearer token and resolves an optional session.
 * Public reads use this so likes/follows personalize when signed in, without
 * rejecting guests. Mutations still use authMiddleware.
 */
export const optionalAuth = createMiddleware({ type: "function" })
  .client(async ({ next }) => {
    const { getBearerToken } = await import("@/lib/auth/client");
    return next({ sendContext: { bearerToken: getBearerToken() ?? undefined } });
  })
  .server(async ({ next, context }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser(context.bearerToken);
    return next({ context: { userId: user?.id ?? null } });
  });
