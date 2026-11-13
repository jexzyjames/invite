import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";

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
      <div className="relative flex h-[240px] w-full max-w-[340px] items-center justify-center sm:h-[300px] sm:max-w-[420px]">
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
          className="absolute z-10 flex h-[180px] w-[84%] flex-col items-center justify-center rounded-sm bg-[#f7f1ed] p-5 text-center text-[#342326] shadow-xl sm:h-[200px] sm:p-6"
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
          className="clip-top-flap absolute inset-x-0 top-0 h-[140px] cursor-pointer bg-gradient-to-b from-[#f7e8d9] via-[#d8a99a] to-[#9a4a5b] shadow-md sm:h-[140px]"
          onClick={handleOpen}
        >
          {/* Wax Seal / Heart Button on Flap Tip */}
          <div className="group absolute bottom-4 left-1/2 z-40 -translate-x-1/2">
            <motion.button
              aria-label="Open invitation"
              onClick={handleOpen}
              title="Open invitation"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-rose-100/50 bg-[#54172b] text-white shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff0d6]"
            >
              <span className="mr-0.5 text-[10px] font-bold tracking-tighter">SS'</span>
              <span className="text-[10px] font-bold tracking-tighter">26</span>
            </motion.button>
            <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#d6bd91]/50 bg-[#2b101c] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#fff0d6] opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
              Tap to open
            </span>
          </div>
        </motion.div>
      </div>

      {/* Open Invitation Trigger Button / Text */}
      <motion.button
        onClick={handleOpen}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="group mt-10 flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-rose-100/80 transition-colors hover:text-white sm:mt-16 sm:text-xs"
      >
        <span>Open Our Invitation</span>
        <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
      </motion.button>

      <section className="mt-8 w-full max-w-[32rem] rounded-2xl border border-[#d6bd91]/30 bg-[#fff8ed]/[0.06] p-4 text-center shadow-lg backdrop-blur-[2px] sm:mt-10 sm:p-6">
        <MapPin className="mx-auto text-[#e2c99e]" size={20} />
        <h2 className="mt-3 font-serif text-lg text-[#fff0d6]">Venue &amp; directions</h2>
        <p className="mt-2 text-sm text-[#fff8ed]">19 Bawala Street, Pedro, Bariga, Lagos</p>
        <p className="mt-1 text-xs text-rose-100/70">Bariga Local Council Development Area Secretariat</p>

        <div className="mt-4 space-y-3 text-left text-xs leading-6 text-rose-100/80 sm:text-sm">
          <p>
            <span className="font-semibold text-[#f4dfc4]">From Berger/Ojota/Mainland:</span> Head toward Palm Grove or Bariga, then take a tricycle to the venue.
          </p>
          <p>
            <span className="font-semibold text-[#f4dfc4]">From Bariga:</span> Take a tricycle going toward Pedro Road or Bawala Street and ask for the LCDA building.
          </p>
          <p>
            <span className="font-semibold text-[#f4dfc4]">From Onipanu:</span> Cross the bridge to the other side and take a tricycle heading toward Pedro Road/Bariga or Bawala Street.
          </p>
          <p>
            <span className="font-semibold text-[#f4dfc4]">From Oshodi:</span> Board a bus to Gbagada/New Garage, alight at Charly Boy bus stop, then take a tricycle to Bariga/Pedro and mention the LCDA at Bawala Street.
          </p>
        </div>

        <a
          className="mt-5 inline-block text-[10px] uppercase tracking-[0.16em] text-[#e2c99e] underline underline-offset-4 transition-colors hover:text-white sm:text-xs"
          href="https://www.google.com/maps/search/?api=1&query=Bariga+Local+Council+Development+Area+Secretariat%2C+19+Bawala+Street%2C+Pedro%2C+Bariga%2C+Lagos"
          target="_blank"
          rel="noreferrer"
        >
          Open in Google Maps
        </a>
      </section>
    </div>
  );
}