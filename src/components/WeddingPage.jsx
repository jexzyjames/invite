import { useEffect, useState } from "react";
import { ArrowRight, Check, Heart, Mail, Sparkles, Ticket, UserRound } from "lucide-react";
import QRCode from "qrcode";
import { readApiResponse } from "../lib/api";

const fieldClass =
  "mt-2 min-h-12 w-full rounded-xl border border-[#e2d3bb] bg-[#fffaf0] px-4 py-3 text-sm text-[#342326] outline-none transition placeholder:text-[#a9988c] focus:border-[#8c3d53] focus:ring-2 focus:ring-[#6f1d35]/15";

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
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#4b1027] px-4 py-10 text-[#f7efdf] sm:px-6 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#a45a66]/15 blur-3xl" />
        <div className="absolute -right-36 bottom-0 h-96 w-96 rounded-full bg-[#d6bd91]/10 blur-3xl" />
      </div>
      <div className="mx-auto w-full max-w-xl">
        <header className="mb-7 text-center sm:mb-9">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#d6bd91]/50 bg-[#641a34] text-[#f7efdf] shadow-lg shadow-black/15">
            <Heart size={20} strokeWidth={1.5} />
          </div>
          <p className="text-[9px] uppercase tracking-[0.28em] text-[#dec79f] sm:text-[10px] sm:tracking-[0.34em]">
            Sarah &amp; Samson · 14 November 2026
          </p>
          <h1 className="mt-3 font-serif text-4xl font-normal text-[#fff7e8] sm:text-5xl">
            Your celebration pass
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#e2d3c3]">
            Create your personal entry pass. You can include your partner on the same pass.
          </p>
        </header>

        <svg
          aria-label="An open wedding invitation envelope"
          className="mx-auto mb-5 w-52 drop-shadow-[0_18px_24px_rgba(20,5,12,0.3)] sm:mb-6 sm:w-60"
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

        <section className="rounded-[1.75rem] border border-white/15 bg-[#f7efdf] p-4 text-[#342326] shadow-[0_28px_90px_-40px_rgba(20,5,12,0.85)] sm:p-7">
          <aside className="mb-6 rounded-2xl border border-[#ddc9aa] bg-[#fffaf0] p-4 text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8e5c62] sm:text-[10px]">
              RSVP questions?
            </p>
            <div className="mt-3 flex flex-col justify-center gap-2 text-sm text-[#54172b] sm:flex-row sm:gap-6">
              <a className="rounded-lg px-2 py-1 underline decoration-[#b88d68] underline-offset-4 transition hover:text-[#8c3d53]" href="tel:7045666940">
                James · 704 566 6940
              </a>
              <a className="rounded-lg px-2 py-1 underline decoration-[#b88d68] underline-offset-4 transition hover:text-[#8c3d53]" href="tel:08124331443">
                Sandra · 0812 433 1443
              </a>
            </div>
          </aside>
          {!pass ? (
            <form className="space-y-5" onSubmit={submit}>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6f1d35]/10 text-[#6f1d35]">
                  <UserRound size={17} />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#54172b]">Who’s coming?</h2>
                  <p className="mt-1 text-xs leading-5 text-[#78686a]">Add your name and, if you like, your partner’s.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
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
                  Partner’s name <span className="font-normal">(optional)</span>
                  <input
                    autoComplete="off"
                    className={fieldClass}
                    maxLength={120}
                    placeholder="Partner’s full name"
                    value={form.partnerName}
                    onChange={(event) => setForm({ ...form, partnerName: event.target.value })}
                  />
                </label>
              </div>
              <div className="rounded-xl border border-[#ddc9aa] bg-[#fffaf0]/75 px-4 py-3 text-xs leading-5 text-[#78686a]">
                One pass covers both names and is checked in once.
              </div>
              <div className="flex items-start gap-3 pt-1">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6f1d35]/10 text-[#6f1d35]">
                  <Mail size={17} />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-[#54172b]">How can we reach you?</h2>
                  <p className="mt-1 text-xs leading-5 text-[#78686a]">We’ll use these details for your guest pass.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
              {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
              <button
                aria-busy={busy}
                className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#6f1d35] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#54172b]/20 transition hover:-translate-y-0.5 hover:bg-[#54172b] disabled:cursor-wait disabled:opacity-60"
                disabled={busy}
                type="submit"
              >
                {busy ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating your pass…
                  </>
                ) : (
                  <>
                    Create my pass
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
              <p className="text-center text-[10px] leading-5 text-[#8b7775]">
                Your details are used only to create and manage your guest pass.
              </p>
            </form>
          ) : (
            <article className="overflow-hidden rounded-2xl border border-[#ddc9aa] bg-[#fffaf0] text-center shadow-inner">
              <div className="bg-gradient-to-r from-[#6f1d35] to-[#8c3d53] px-5 py-5 text-[#fff8ed] sm:py-6">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10">
                  <Check size={20} />
                </div>
                <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#f4dfc4]">
                  Pass confirmed
                </p>
                <p className="mt-2 font-serif text-2xl">You’re on the list!</p>
              </div>
              <div className="p-5 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#9b7071]">
                You are warmly invited
              </p>
              <p className="mt-3 break-words font-serif text-3xl text-[#54172b]">{pass.name}</p>
              <div className="mx-auto my-5 h-px w-14 bg-[#b88d68]" />
              <p className="font-serif text-xl text-[#54172b]">Sarah &amp; Samson</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#8e5c62]">
                Engagement Celebration
              </p>
              <p className="mt-1 text-sm text-[#59474a]">Saturday, 14 November 2026 <span className="font-semibold  ">11:00 AM</span></p>
              <div className="mx-auto mt-7 flex max-w-xs items-center justify-center gap-2 rounded-xl border border-[#d6bd91]/20 bg-[#54172b] px-4 py-4 text-[#fff8ed] shadow-md">
                <Ticket size={17} />
                <span className="break-all font-mono text-sm tracking-[0.12em]">{pass.code}</span>
              </div>
              {qrCode && (
                <div className="mx-auto mt-6 w-fit rounded-2xl border border-[#ddc9aa] bg-white p-4 shadow-sm">
                  <img alt={`QR code for ${pass.name}'s guest pass`} className="h-52 w-52" src={qrCode} />
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8e5c62]">
                    Show this QR code at check-in
                  </p>
                </div>
              )}
              {!qrCode && !qrError && (
                <p className="mt-5 text-xs text-[#78686a]" role="status">Preparing your QR code…</p>
              )}
              {qrError && <p className="mt-4 text-sm text-red-700" role="alert">{qrError}</p>}
              <div className="mx-auto mt-5 flex max-w-sm items-start gap-2 rounded-xl bg-[#f3e7d2] p-3 text-left text-xs leading-5 text-[#78686a]">
                <Sparkles className="mt-0.5 shrink-0 text-[#9b7071]" size={15} />
                <p>
                Keep this pass private. A host can scan the QR code or enter its code at check-in, and it can only be used once.
                </p>
              </div>
              <button
                className="mt-6 min-h-10 rounded-full px-4 text-xs font-medium text-[#7b4b55] underline underline-offset-4 transition hover:text-[#54172b]"
                onClick={() => {
                  setPass(null);
                  setForm({ name: "", partnerName: "", email: "", phone: "" });
                }}
                type="button"
              >
                Create another pass
              </button>
              </div>
            </article>
          )}
        </section>
        <footer className="mt-6 flex justify-center text-xs text-[#dec79f]">
          <a className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 underline underline-offset-4 transition hover:text-white" href="/validate">
            <Ticket size={14} />
            Host check-in
          </a>
        </footer>
      </div>
    </main>
  );
}
