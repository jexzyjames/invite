import { useState } from "react";
import { ArrowRight, Check, Heart, Ticket } from "lucide-react";
import { readApiResponse } from "../lib/api";

const fieldClass =
  "mt-2 w-full rounded-xl border border-[#e2d3bb] bg-[#fffaf0] px-4 py-3 text-sm text-[#342326] outline-none transition placeholder:text-[#a9988c] focus:border-[#8c3d53] focus:ring-2 focus:ring-[#6f1d35]/15";

export default function WeddingPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [pass, setPass] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
          email: form.email.trim(),
          phone: form.phone.trim(),
        }),
      });
      const result = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(result.error || "We couldn't create your pass. Please try again.");
      }

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
            Enter your details to create your personal access pass for the engagement celebration.
          </p>
        </header>

        <section className="rounded-3xl border border-[#e2d3bb] bg-[#f7efdf] p-6 shadow-[0_24px_70px_-38px_rgba(20,5,12,0.75)] sm:p-9">
          {!pass ? (
            <form className="space-y-5" onSubmit={submit}>
              <label className="block text-xs font-medium text-[#684e52]">
                Full name
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
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6f1d35] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#54172b] disabled:cursor-wait disabled:opacity-60"
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
              <p className="mt-3 text-xs leading-5 text-[#78686a]">
                Keep this code private. A host will validate it at check-in, and it can only be used once.
              </p>
              <button
                className="mt-6 text-xs text-[#7b4b55] underline underline-offset-4"
                onClick={() => {
                  setPass(null);
                  setForm({ name: "", email: "", phone: "" });
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
