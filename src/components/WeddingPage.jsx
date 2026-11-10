import { useEffect, useState } from "react";
import { ArrowRight, Check, Heart, Ticket } from "lucide-react";
import QRCode from "qrcode";
import { readApiResponse } from "../lib/api";

const fieldClass =
  "mt-2 w-full rounded-xl border border-[#e2d3bb] bg-[#fffaf0] px-4 py-3 text-sm text-[#342326] outline-none transition placeholder:text-[#a9988c] focus:border-[#8c3d53] focus:ring-2 focus:ring-[#6f1d35]/15";

export default function WeddingPage() {
  const [form, setForm] = useState({ name: "", partnerName: "", email: "", phone: "" });
  const [pass, setPass] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [qrError, setQrError] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!pass?.code) return undefined;

    let active = true;
    QRCode.toDataURL(pass.code, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 220,
      color: { dark: "#54172b", light: "#fffaf0" },
    })
      .then((dataUrl) => {
        if (active) setQrCode(dataUrl);
      })
      .catch(() => {
        if (active) setQrError("Could not create your QR code. Please keep your pass code for check-in.");
      });

    return () => {
      active = false;
    };
  }, [pass]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/passes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          partnerName: form.partnerName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        }),
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(result.error || "We couldn't create your pass. Please try again.");
      }

      setQrCode("");
      setQrError("");
      setPass(result);
    } catch (requestError) {
      setError(requestError.message || "Could not reach the pass service. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#4b1027] px-4 py-12 text-[#f7efdf] sm:px-6 sm:py-20">
      <div className="mx-auto max-w-xl">
        <header className="mb-10 text-center sm:mb-14">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#d6bd91]/50 bg-[#641a34] text-[#f7efdf]">
            <Heart size={20} strokeWidth={1.5} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#dec79f]">
            Sarah &amp; Samson · 14 November 2026
          </p>
          <h1 className="mt-4 font-serif text-4xl font-normal text-[#fff7e8] sm:text-5xl">
            Your invitation
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#e2d3c3]">
            Create an access pass for yourself or share one pass with your partner for the engagement celebration.
          </p>
        </header>

        <svg
          aria-label="An open wedding invitation envelope"
          className="mx-auto mb-8 w-64 drop-shadow-[0_18px_24px_rgba(20,5,12,0.3)] sm:w-72"
          fill="none"
          role="img"
          viewBox="0 0 320 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="envelope-paper" x1="68" x2="252" y1="26" y2="158" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fffaf0" />
              <stop offset="1" stopColor="#eadbc8" />
            </linearGradient>
            <linearGradient id="envelope-fabric" x1="28" x2="292" y1="82" y2="178" gradientUnits="userSpaceOnUse">
              <stop stopColor="#bd7d7a" />
              <stop offset="1" stopColor="#762d45" />
            </linearGradient>
          </defs>
          <ellipse cx="160" cy="184" fill="#1e0912" fillOpacity=".3" rx="116" ry="10" />
          <path d="M22 80 160 13l138 67-138 73L22 80Z" fill="#a45a66" stroke="#d6bd91" strokeOpacity=".7" strokeWidth="2" />
          <rect fill="url(#envelope-paper)" height="137" rx="4" width="184" x="68" y="24" />
          <text fill="#9b7071" fontFamily="Georgia,serif" fontSize="10" letterSpacing="2.2" textAnchor="middle" x="160" y="65">
            YOU&apos;RE INVITED
          </text>
          <text fill="#54172b" fontFamily="Georgia,serif" fontSize="21" textAnchor="middle" x="160" y="96">
            Sarah &amp; Samson
          </text>
          <path d="M132 108h56" stroke="#b88d68" />
          <text fill="#78686a" fontFamily="Georgia,serif" fontSize="10" letterSpacing="1.5" textAnchor="middle" x="160" y="128">
            14 · 11 · 2026
          </text>
          <rect fill="url(#envelope-fabric)" height="96" rx="5" width="276" x="22" y="77" />
          <path d="m22 80 138 77L298 80v87a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V80Z" fill="url(#envelope-fabric)" stroke="#d6bd91" strokeOpacity=".65" strokeWidth="2" />
          <circle cx="160" cy="143" fill="#54172b" r="18" stroke="#e8d4b0" strokeWidth="2" />
          <path d="M160 151s-8-4.9-8-10.2a4.2 4.2 0 0 1 8-1.8 4.2 4.2 0 0 1 8 1.8c0 5.3-8 10.2-8 10.2Z" fill="#fff0d6" />
        </svg>

        <section className="rounded-3xl border border-[#e2d3bb] bg-[#f7efdf] p-6 shadow-[0_24px_70px_-38px_rgba(20,5,12,0.75)] sm:p-9">
          <aside className="mb-6 rounded-2xl border border-[#ddc9aa] bg-[#fffaf0] p-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8e5c62]">
              RSVP questions?
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#54172b]">
              <a className="underline decoration-[#b88d68] underline-offset-4" href="tel:7045666940">
                James · 704 566 6940
              </a>
              <a className="underline decoration-[#b88d68] underline-offset-4" href="tel:08124331443">
                Sandra · 0812 433 1443
              </a>
            </div>
          </aside>
          {!pass ? (
            <form className="space-y-5" onSubmit={submit}>
              <label className="block text-xs font-medium text-[#684e52]">
                Your full name
                <input
                  autoComplete="name"
                  className={fieldClass}
                  maxLength={120}
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </label>
              <label className="block text-xs font-medium text-[#684e52]">
                Partner's full name <span className="font-normal">(optional)</span>
                <input
                  autoComplete="off"
                  className={fieldClass}
                  maxLength={120}
                  placeholder="Add your partner to this pass"
                  value={form.partnerName}
                  onChange={(event) => setForm({ ...form, partnerName: event.target.value })}
                />
              </label>
              <p className="-mt-2 text-xs leading-5 text-[#78686a]">
                One pass covers both names and is checked in once. Enter one contact email and phone number for the pass.
              </p>
              <label className="block text-xs font-medium text-[#684e52]">
                Email address
                <input
                  autoComplete="email"
                  className={fieldClass}
                  maxLength={254}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </label>
              <label className="block text-xs font-medium text-[#684e52]">
                Phone number
                <input
                  autoComplete="tel"
                  className={fieldClass}
                  maxLength={40}
                  placeholder="Your phone number"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </label>
              {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
              <button
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#6f1d35] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#54172b] disabled:cursor-wait disabled:opacity-60"
                disabled={busy}
                type="submit"
              >
                {busy ? "Creating your pass…" : "Create my pass"}
                <ArrowRight size={15} />
              </button>
            </form>
          ) : (
            <article className="rounded-2xl border border-[#ddc9aa] bg-[#fffaf0] p-6 text-center sm:p-9">
              <Check className="mx-auto text-[#6f1d35]" size={22} />
              <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-[#9b7071]">
                You are warmly invited
              </p>
              <p className="mt-5 break-words font-serif text-3xl text-[#54172b]">{pass.name}</p>
              <div className="mx-auto my-5 h-px w-14 bg-[#b88d68]" />
              <p className="font-serif text-xl text-[#54172b]">Sarah &amp; Samson</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#8e5c62]">
                Engagement Celebration
              </p>
              <p className="mt-1 text-sm text-[#59474a]">Saturday, 14 November 2026</p>
              <div className="mx-auto mt-7 flex max-w-xs items-center justify-center gap-2 rounded-xl bg-[#54172b] px-4 py-4 text-[#fff8ed]">
                <Ticket size={17} />
                <span className="break-all font-mono text-sm tracking-[0.12em]">{pass.code}</span>
              </div>
              {qrCode && (
                <div className="mx-auto mt-5 w-fit rounded-xl border border-[#ddc9aa] bg-[#fffaf0] p-3">
                  <img alt={`QR code for ${pass.name}'s guest pass`} className="h-52 w-52" src={qrCode} />
                  <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#8e5c62]">
                    Show this QR code at check-in
                  </p>
                </div>
              )}
              {qrError && <p className="mt-4 text-sm text-red-700" role="alert">{qrError}</p>}
              <p className="mt-3 text-xs leading-5 text-[#78686a]">
                Keep this pass private. A host can scan the QR code or enter its code at check-in, and it can only be used once.
              </p>
              <button
                className="mt-6 text-xs text-[#7b4b55] underline underline-offset-4"
                onClick={() => {
                  setPass(null);
                  setForm({ name: "", partnerName: "", email: "", phone: "" });
                }}
                type="button"
              >
                Create another pass
              </button>
            </article>
          )}
        </section>
        <footer className="mt-8 text-center text-xs text-[#dec79f]">
          <a className="underline underline-offset-4" href="/validate">Host check-in</a>
        </footer>
      </div>
    </main>
  );
}
