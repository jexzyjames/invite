import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Check, Search, ShieldCheck, X } from "lucide-react";
import { readApiResponse } from "../lib/api";

export default function ValidationPage() {
  const [adminToken, setAdminToken] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerMessage, setScannerMessage] = useState("");
  const videoRef = useRef(null);
  const busyRef = useRef(false);
  const invalidQrRef = useRef(false);

  const validatePass = useCallback(async (passCode) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/validate-pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Checkin-Token": adminToken,
        },
        body: JSON.stringify({ code: passCode.trim().toUpperCase() }),
      });
      const data = await readApiResponse(response);

      if (!response.ok) {
        setError(data.error || "Could not validate this pass.");
      } else {
        setResult(data);
        setCode("");
      }
    } catch {
      setError("Could not reach the validation service. Please try again.");
    } finally {
      setBusy(false);
      busyRef.current = false;
    }
  }, [adminToken]);

  const validate = (event) => {
    event.preventDefault();
    void validatePass(code);
  };

  useEffect(() => {
    if (!scannerActive) return undefined;

    let cancelled = false;
    let scannerControls;
    let stoppedControls;

    const stopScanner = (controls) => {
      if (!controls || controls === stoppedControls) return;

      stoppedControls = controls;
      if (scannerControls === controls) scannerControls = null;
      try {
        const stopResult = controls.stop();
        if (stopResult && typeof stopResult.then === "function") {
          void stopResult.catch((stopError) => {
            console.error("Could not stop the QR scanner cleanly.", stopError);
          });
        }
      } catch (stopError) {
        console.error("Could not stop the QR scanner cleanly.", stopError);
      }
    };

    const startScanner = async () => {
      try {
        const { BrowserQRCodeReader } = await import("@zxing/browser");
        if (cancelled) return;
        if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access requires HTTPS or localhost. Open this page over a secure connection.");
        }
        const reader = new BrowserQRCodeReader();
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (decoded, _scanError, scanControls) => {
            if (!decoded || busyRef.current) return;

            const scannedCode = decoded.getText().trim().toUpperCase();
            if (!/^SS-2026-(?:[A-Z0-9]{1,4}|GUEST)-[A-F0-9]{20}$/.test(scannedCode)) {
              if (!invalidQrRef.current) {
                invalidQrRef.current = true;
                setError("QR detected, but it does not contain a guest pass code. Try another QR code or enter the pass code manually.");
              }
              return;
            }

            stopScanner(scanControls);
            setScannerActive(false);
            setScannerMessage("");
            setCode(scannedCode);
            void validatePass(scannedCode);
          },
        );

        if (cancelled || stoppedControls === controls) {
          stopScanner(controls);
        } else {
          scannerControls = controls;
          setScannerMessage("Camera is ready. Point it at the guest's QR code.");
        }
      } catch (scanError) {
        if (!cancelled) {
          const cameraErrorMessages = {
            NotAllowedError: "Camera access was denied. Allow camera permission in your browser settings, then try again.",
            NotFoundError: "No camera was found on this device.",
            NotReadableError: "The camera is already in use by another app. Close it and try again.",
            OverconstrainedError: "No compatible camera was found on this device.",
          };
          setError(
            scanError instanceof Error
              ? cameraErrorMessages[scanError.name] || `Could not start the camera: ${scanError.message}`
              : "Could not start the camera. Allow camera access or enter the code manually.",
          );
          setScannerMessage("");
          setScannerActive(false);
        }
      }
    };

    void startScanner();
    return () => {
      cancelled = true;
      stopScanner(scannerControls);
    };
  }, [scannerActive, validatePass]);

  return (
    <main className="min-h-screen bg-[#4b1027] px-4 py-12 text-[#f7efdf] sm:px-6 sm:py-16">
      <div className="mx-auto max-w-lg">
        <header className="mb-9 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#d6bd91]/50 bg-[#641a34] text-[#f7efdf]">
            <ShieldCheck size={21} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#dec79f]">Sarah &amp; Samson</p>
          <h1 className="mt-2 font-serif text-4xl text-[#fff7e8]">Guest check-in</h1>
          <p className="mt-3 text-sm text-[#e2d3c3]">Scan a guest pass QR code or enter its code to validate and check in its holder.</p>
        </header>

        <section className="rounded-3xl border border-[#e2d3bb] bg-[#f7efdf] p-6 text-[#342326] shadow-[0_24px_70px_-38px_rgba(20,5,12,0.75)] sm:p-8">
          <form className="space-y-5" onSubmit={validate}>
            <label className="block text-xs font-medium text-[#684e52]">
              Host check-in key
              <input
                autoComplete="off"
                className="mt-2 w-full rounded-xl border border-[#e2d3bb] bg-[#fffaf0] px-4 py-3 text-sm text-[#342326] outline-none focus:border-[#8c3d53] focus:ring-2 focus:ring-[#6f1d35]/15"
                required
                type="password"
                value={adminToken}
                onChange={(event) => setAdminToken(event.target.value)}
              />
            </label>
            <label className="block text-xs font-medium text-[#684e52]">
              Guest pass code
              <input
                autoComplete="off"
                className="mt-2 w-full rounded-xl border border-[#e2d3bb] bg-[#fffaf0] px-4 py-3 font-mono text-lg uppercase tracking-[0.16em] text-[#342326] outline-none placeholder:text-[#a9988c] focus:border-[#8c3d53] focus:ring-2 focus:ring-[#6f1d35]/15"
                placeholder="SS-2026-INITIALS-…"
                required
                value={code}
                onChange={(event) => setCode(event.target.value)}
              />
            </label>
            {scannerActive ? (
              <div className="space-y-3">
                <video
                  autoPlay
                  className="w-full rounded-xl bg-black"
                  muted
                  playsInline
                  ref={videoRef}
                />
                <p className="text-center text-xs text-[#78686a]" role="status">{scannerMessage}</p>
                <button
                  className="w-full rounded-full border border-[#8c3d53] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#6f1d35] transition hover:bg-[#f3e7d2]"
                  onClick={() => {
                    setScannerMessage("");
                    setScannerActive(false);
                  }}
                  type="button"
                >
                  Stop camera
                </button>
              </div>
            ) : (
              <button
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#8c3d53] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#6f1d35] transition hover:bg-[#f3e7d2] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!adminToken.trim() || busy}
                onClick={() => {
                  setError("");
                  setScannerMessage("Starting camera…");
                  invalidQrRef.current = false;
                  setScannerActive(true);
                }}
                type="button"
              >
                <Camera size={15} /> Scan guest QR code
              </button>
            )}
            <button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6f1d35] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#54172b] disabled:cursor-wait disabled:opacity-60"
              disabled={busy}
              type="submit"
            >
              <Search className="cursor-pointer" size={15} /> {busy ? "Checking…" : "Validate & check in"}
            </button>
          </form>

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-800" role="alert">
              <X className="mt-0.5 shrink-0" size={18} />
              <p>{error}</p>
            </div>
          )}
          {result && (
            <div
              className={`mt-5 flex items-start gap-3 rounded-xl p-4 text-sm ${
                result.valid ? "bg-[#e9efdf] text-[#385a3b]" : "bg-[#f3e7d2] text-[#704e22]"
              }`}
              role="status"
            >
              {result.valid ? <Check className="mt-0.5 shrink-0" size={18} /> : <X className="mt-0.5 shrink-0" size={18} />}
              <div>
                <p className="font-semibold">{result.valid ? "Valid pass — checked in" : "Pass not valid"}</p>
                {result.valid && (
                  <p className="mt-1">
                    {result.name} · {result.email}
                  </p>
                )}
                {!result.valid && <p className="mt-1">{result.reason}</p>}
              </div>
            </div>
          )}

          <p className="mt-5 text-xs leading-5 text-[#78686a]">
            Scanning requires camera permission and a secure connection (HTTPS). A valid pass is marked used immediately; copied or already-used passes will be rejected.
          </p>
        </section>
        <footer className="mt-8 text-center text-xs text-[#dec79f]">
          <a className="underline underline-offset-4" href="/wedding">Return to invitation</a>
        </footer>
      </div>
    </main>
  );
}
