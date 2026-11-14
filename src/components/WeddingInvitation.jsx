import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Gift, MapPin, Navigation } from "lucide-react";

export default function WeddingInvitation({ onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[#2b101c] px-3 py-8 font-sans text-[#fff8ed] sm:px-4 sm:py-10">
      {/* Background subtle radial glow / orbit lines */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
        <div className="absolute h-[600px] w-[600px] rounded-full border border-rose-200/20" />
        <div className="absolute h-[900px] w-[900px] rounded-full border border-rose-200/10" />
      </div>

      {/* Header text */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8 text-center font-serif text-[11px] italic tracking-[0.25em] text-rose-100/80 sm:mb-12 sm:text-sm"
      >
        Together with their families
      </motion.p>

      {/* Envelope Container */}
      <div className="relative flex h-[210px] w-full max-w-[300px] items-center justify-center sm:h-[260px] sm:max-w-[360px]">
        {/* Invitation Letter (Slides up when opened) */}
        <motion.div
          initial={{ y: 0, opacity: 0.9 }}
          animate={
            isOpen
              ? { y: -80, opacity: 1, zIndex: 40 }
              : { y: 0, opacity: 0.9, zIndex: 10 }
          }
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => {
            if (isOpen) onOpen();
          }}
          className="absolute z-10 flex h-[155px] w-[84%] flex-col items-center justify-center rounded-sm bg-[#f7f1ed] p-4 text-center text-[#342326] shadow-xl sm:h-[175px] sm:p-5"
        >
          <span className="mb-1 font-serif text-[10px] uppercase tracking-[0.26em] text-[#9b7071] sm:text-xs">
            You’re invited
          </span>
          <h2 className="mb-2 font-serif text-lg text-[#54172b] sm:text-xl">
            Sarah &amp; Samson
          </h2>
          <div className="my-2 h-px w-12 bg-[#d8c8bd]" />
          <p className="text-[10px] tracking-[0.18em] text-[#78686a] sm:text-xs">
            14 · 11 · 2026
          </p>
        </motion.div>

        {/* Envelope Back / Base */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-b-md bg-gradient-to-b from-[#bd7d7a] to-[#762d45] shadow-2xl" />

        {/* Envelope Left Flap */}
        <div className="clip-left-flap pointer-events-none absolute inset-0 z-30 rounded-bl-md bg-gradient-to-r from-[#883c50] to-[#a45a66]" />

        {/* Envelope Right Flap */}
        <div className="clip-right-flap pointer-events-none absolute inset-0 z-30 rounded-br-md bg-gradient-to-l from-[#883c50] to-[#a45a66]" />

        {/* Envelope Top Flap (Animated) */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={isOpen ? { rotateX: 180, zIndex: 5 } : { rotateX: 0, zIndex: 35 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="clip-top-flap absolute inset-x-0 top-0 h-[120px] cursor-pointer bg-gradient-to-b from-[#f7e8d9] via-[#d8a99a] to-[#9a4a5b] shadow-md sm:h-[125px]"
          onClick={handleOpen}
        >
          {/* Wax Seal / Heart Button on Flap Tip */}
          <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="whitespace-nowrap rounded-full border border-[#d6bd91]/50 bg-[#2b101c] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#fff0d6] shadow-lg">
              Tap to open
            </span>
            <motion.button
              aria-label="Open invitation"
              onClick={handleOpen}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-rose-100/50 bg-[#54172b] text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff0d6]"
            >
              <span className="mr-0.5 text-[10px] font-bold tracking-tighter">SS'</span>
              <span className="text-[10px] font-bold tracking-tighter">26</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Open Invitation Trigger Button / Text */}
      <motion.button
        onClick={handleOpen}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="group mt-8 flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-rose-100/80 transition-colors hover:text-white sm:mt-12 sm:text-xs"
      >
        <span>Open Our Invitation</span>
        <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
      </motion.button>

      <section className="mt-6 w-full max-w-[32rem] overflow-hidden rounded-3xl border border-[#d6bd91]/25 bg-gradient-to-br from-[#fff8ed]/[0.1] to-[#fff8ed]/[0.03] p-4 shadow-xl shadow-black/10 backdrop-blur sm:mt-8 sm:p-6">
        <div className="flex items-center gap-3 text-left">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d6bd91]/30 bg-[#d6bd91]/10 text-[#e2c99e]">
            <MapPin size={20} />
          </span>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#e2c99e]">Join us in Lagos</p>
            <h2 className="mt-1 font-serif text-xl text-[#fff0d6]">Venue &amp; directions</h2>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-[#2b101c]/45 p-4 text-left">
          <p className="text-sm font-medium leading-6 text-[#fff8ed]">19 Bawala Street, Pedro, Bariga, Lagos</p>
          <p className="mt-1 text-xs leading-5 text-rose-100/65">Bariga Local Council Development Area Secretariat</p>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center gap-2 text-left text-[9px] font-semibold uppercase tracking-[0.22em] text-[#e2c99e]">
            <Navigation size={13} />
            Getting here
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#e2c99e]">Berger / Ojota / Mainland</span>
              <p className="mt-1.5 text-xs leading-5 text-rose-100/80">Head toward Palm Grove or Bariga, then take a tricycle to the venue.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#e2c99e]">Bariga</span>
              <p className="mt-1.5 text-xs leading-5 text-rose-100/80">Take a tricycle toward Pedro Road or Bawala Street and ask for the LCDA building.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#e2c99e]">Onipanu</span>
              <p className="mt-1.5 text-xs leading-5 text-rose-100/80">Cross the bridge, then take a tricycle toward Pedro Road/Bariga or Bawala Street.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#e2c99e]">Oshodi</span>
              <p className="mt-1.5 text-xs leading-5 text-rose-100/80">Take a bus to Gbagada/New Garage. At Charly Boy bus stop, take a tricycle to Bariga/Pedro and ask for the LCDA on Bawala Street.</p>
            </div>
          </div>
        </div>

        <a
          className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#d6bd91]/40 bg-[#d6bd91]/10 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f4dfc4] transition-colors hover:bg-[#d6bd91]/20 hover:text-white sm:text-xs"
          href="https://www.google.com/maps/search/?api=1&query=Bariga+Local+Council+Development+Area+Secretariat%2C+19+Bawala+Street%2C+Pedro%2C+Bariga%2C+Lagos"
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={14} />
          Open in Google Maps
          <ArrowUpRight size={14} />
        </a>
      </section>

      <section className="relative mt-4 w-full max-w-[32rem] overflow-hidden rounded-3xl border border-[#d6bd91]/30 bg-gradient-to-br from-[#6c2a3e]/80 via-[#4b1b2d]/80 to-[#fff8ed]/[0.04] p-4 text-center shadow-xl shadow-black/10 backdrop-blur sm:p-6">
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border border-[#d6bd91]/10" />
        <div className="relative flex items-center gap-3 text-left">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#d6bd91]/35 bg-[#d6bd91]/10 text-[#e2c99e]">
            <Gift size={20} />
          </span>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#e2c99e]">With gratitude</p>
            <h2 className="mt-1 font-serif uppercase text-xl text-[#fff0d6]">Gifts</h2>
          </div>
        </div>
        <p className="relative mt-3 text-left text-xs leading-5 text-rose-100/75 sm:text-sm">
          Your presence is our greatest gift. For those who wish to give, details are below.
        </p>
        <div className="relative mt-4 rounded-2xl border border-[#d6bd91]/25 bg-[#2b101c]/50 p-4 text-left">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <span className="text-[10px] uppercase tracking-[0.16em] text-rose-100/60">Bank</span>
            <span className="rounded-full border border-[#d6bd91]/30 bg-[#d6bd91]/10 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[#f4dfc4]">GTB</span>
          </div>
          <div className="mt-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-rose-100/60">Account name</p>
            <p className="mt-1 break-words  uppercase text-sm font-medium text-[#fff8ed]"> Jegede Sarah Oluwafunmilayo</p>
          </div>
          <div className="mt-3 rounded-xl border border-[#d6bd91]/20 bg-[#fff8ed]/[0.05] px-3 py-2.5">
            <p className="text-[9px] uppercase tracking-[0.16em] text-rose-100/55">Account number</p>
            <p className="mt-1 font-mono text-lg font-semibold tracking-[0.18em] text-[#f4dfc4]">0124753319</p>
          </div>
        </div>
      </section>
    </div>
  );
}