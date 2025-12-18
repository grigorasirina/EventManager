import type { Request, Response, NextFunction } from "express";

/**
 * TEMP AUTH (for MVP):
 * - Pass x-user-id and x-user-role headers from frontend/Postman
 * - Will replace later with Google auth / session validation
 */
export type AuthedRequest = Request & {
  user?: { id: string; role: "USER" | "STAFF" | "ADMIN" };
};

export function requireUser(req: AuthedRequest, res: Response, next: NextFunction) {
  const id = req.header("x-user-id");
  const role = (req.header("x-user-role") || "USER") as AuthedRequest["user"]["role"];

  if (!id) return res.status(401).json({ error: "Missing x-user-id" });

  req.user = { id, role };
  next();
}

export function requireStaff(req: AuthedRequest, res: Response, next: NextFunction) {
  requireUser(req, res, () => {
    if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
    if (req.user.role !== "STAFF" && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Staff only" });
    }
    next();
  });
}
