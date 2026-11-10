import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";

export default function WeddingInvitation({ onOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[#2b101c] px-4 py-10 font-sans text-[#fff8ed]">
      {/* Background subtle radial glow / orbit lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="absolute h-[600px] w-[600px] rounded-full border border-rose-200/20" />
        <div className="absolute h-[900px] w-[900px] rounded-full border border-rose-200/10" />
      </div>

      {/* Header text */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12 text-center font-serif text-sm italic tracking-[0.25em] text-rose-100/80"
      >
        Together with their families
      </motion.p>

      {/* Envelope Container */}
      <div className="relative w-[340px] sm:w-[420px] h-[260px] sm:h-[300px] flex items-center justify-center">
        
        {/* Invitation Letter (Slides up when opened) */}
        <motion.div
          initial={{ y: 0, opacity: 0.9 }}
          animate={isOpen
            ? { y: -80, opacity: 1, zIndex: 40 }
            : { y: 0, opacity: 0.9, zIndex: 10 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => {
            if (isOpen) onOpen()
          }}
          className="absolute z-10 flex h-[200px] w-[85%] flex-col items-center justify-center rounded-sm bg-[#f7f1ed] p-6 text-center text-[#342326] shadow-xl"
        >
          <span className="mb-1 font-serif text-xs uppercase tracking-widest text-[#9b7071]">
            You’re invited
          </span>
          <h2 className="mb-2 font-serif text-xl text-[#54172b]">
            Sarah & Samson
          </h2>
          <div className="my-2 h-px w-12 bg-[#d8c8bd]" />
          <p className="text-xs tracking-wider text-[#78686a]">
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
          className="clip-top-flap absolute inset-x-0 top-0 h-[140px] cursor-pointer bg-gradient-to-b from-[#f7e8d9] via-[#d8a99a] to-[#9a4a5b] shadow-md"
          onClick={handleOpen}
        >
          {/* Wax Seal / Heart Button on Flap Tip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-rose-100/50 bg-[#54172b] text-white shadow-lg"
            >
              <span className="text-xs font-bold tracking-tighter mr-0.5">SS</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Open Invitation Trigger Button / Text */}
      <motion.button
        onClick={handleOpen}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="group mt-16 flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.25em] text-rose-100/80 transition-colors hover:text-white"
      >
        <span>Open Our Invitation</span>
        <ChevronDown className="w-4 h-4 transform group-hover:translate-y-0.5 transition-transform" />
      </motion.button>

      <section className="mt-10 w-full max-w-md rounded-2xl border border-[#d6bd91]/30 bg-[#fff8ed]/[0.06] p-5 text-center sm:p-6">
        <MapPin className="mx-auto text-[#e2c99e]" size={20} />
        <h2 className="mt-3 font-serif text-lg text-[#fff0d6]">Venue &amp; directions</h2>
        <p className="mt-2 text-sm text-[#fff8ed]">19 Bawala Street, Pedro, Bariga, Lagos</p>
        <p className="mt-1 text-xs text-rose-100/70">Bariga Local Council Development Area Secretariat</p>
        <p className="mt-2 text-xs leading-5 text-rose-100/75">
          Find your way to Palmgroove or Bariga, then take a napep to the venue.
        </p>
        <a
          className="mt-4 inline-block text-xs uppercase tracking-[0.16em] text-[#e2c99e] underline underline-offset-4 hover:text-white"
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