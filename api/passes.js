import { randomBytes } from "node:crypto";
import { ensurePassesTable, getDatabase } from "./_lib/db.js";
import { json, readJsonBody } from "./_lib/http.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getNameTag(name) {
  const initials = name
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .split(/[^\p{Letter}\p{Number}]+/u)
    .filter(Boolean)
    .slice(0, 4)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

  return initials || "GUEST";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  const body = readJsonBody(req);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const partnerName = typeof body?.partnerName === "string" ? body.partnerName.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const guestNames = partnerName ? `${name} & ${partnerName}` : name;

  if (!name || name.length > 120) return json(res, 400, { error: "Enter a valid name." });
  if (partnerName.length > 120 || guestNames.length > 120) {
    return json(res, 400, { error: "Keep both names within 120 characters combined." });
  }
  if (!emailPattern.test(email) || email.length > 254) {
    return json(res, 400, { error: "Enter a valid email address." });
  }
  if (phone.length < 3 || phone.length > 40) {
    return json(res, 400, { error: "Enter a valid phone number." });
  }

  try {
    const database = getDatabase();
    await ensurePassesTable(database);

    let code;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      code = `SS-2026-${getNameTag(guestNames)}-${randomBytes(10).toString("hex").toUpperCase()}`;
      try {
        await database`
          INSERT INTO guest_passes (name, email, phone, pass_code)
          VALUES (${guestNames}, ${email}, ${phone}, ${code})
        `;
        break;
      } catch (error) {
        if (error.code !== "23505" || attempt === 2) throw error;
      }
    }

    return json(res, 201, { name: guestNames, guestCount: partnerName ? 2 : 1, code });
  } catch (error) {
    console.error("Could not create guest pass", error);
    if (error.message === "DATABASE_NOT_CONFIGURED") {
      return json(res, 503, {
        error: "Database not configured. Add a Neon connection string as DATABASE_URL to .env.local, then restart the dev server.",
      });
    }
    return json(res, 503, {
      error: "Pass creation is temporarily unavailable. Please try again or contact the hosts.",
    });
  }
}
