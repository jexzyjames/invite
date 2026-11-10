import { timingSafeEqual } from "node:crypto";
import { ensurePassesTable, getDatabase } from "./_lib/db.js";
import { json, readJsonBody } from "./_lib/http.js";

function isAuthorized(req) {
  const expected = process.env.CHECKIN_ADMIN_TOKEN;
  const received = req.headers["x-checkin-token"];
  if (!expected || typeof received !== "string") return false;

  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(received);
  return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }
  if (!process.env.CHECKIN_ADMIN_TOKEN) {
    return json(res, 503, { error: "Check-in is not configured. Set CHECKIN_ADMIN_TOKEN in Vercel." });
  }
  if (!isAuthorized(req)) return json(res, 401, { error: "Invalid host check-in key." });

  const body = readJsonBody(req);
  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : "";
  if (!/^SS-2026-(?:[A-Z0-9]{1,4}|GUEST)-[A-F0-9]{20}$/.test(code)) {
    return json(res, 200, { valid: false, reason: "This code is not valid." });
  }

  try {
    const database = getDatabase();
    await ensurePassesTable(database);

    const checkedIn = await database`
      UPDATE guest_passes
      SET checked_in_at = now()
      WHERE pass_code = ${code} AND checked_in_at IS NULL
      RETURNING name, email, checked_in_at
    `;

    if (checkedIn.length) {
      return json(res, 200, {
        valid: true,
        name: checkedIn[0].name,
        email: checkedIn[0].email,
        checkedInAt: checkedIn[0].checked_in_at,
      });
    }

    const existing = await database`
      SELECT checked_in_at
      FROM guest_passes
      WHERE pass_code = ${code}
      LIMIT 1
    `;

    if (!existing.length) {
      return json(res, 200, { valid: false, reason: "No pass with this code was issued." });
    }

    return json(res, 200, { valid: false, reason: "This pass has already been used." });
  } catch (error) {
    console.error("Could not validate guest pass", error);
    if (error.message === "DATABASE_NOT_CONFIGURED") {
      return json(res, 503, {
        error: "Database not configured. Add a Neon connection string as DATABASE_URL to .env.local, then restart the dev server.",
      });
    }
    return json(res, 503, { error: "Pass validation is temporarily unavailable. Please try again." });
  }
}
