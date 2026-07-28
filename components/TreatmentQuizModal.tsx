"use client";

import React, { useState } from "react";
import { X, ArrowRight, CheckCircle2, Sparkles, Activity, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface TreatmentQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TreatmentQuizModal({ isOpen, onClose }: TreatmentQuizModalProps) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectGoal = (selected: string) => {
    setGoal(selected);
    setStep(2);
  };

  const handleSelectExperience = (selected: string) => {
    setExperience(selected);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 600);
  };

  const handleReset = () => {
    setStep(1);
    setGoal("");
    setExperience("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#141815] text-white rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl overflow-hidden">
        {/* Decorative ambient background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono tracking-wider uppercase mb-2">
          <Sparkles size={14} />
          <span>Good Life Online Health Assessment</span>
        </div>

        {step === 1 && (
          <div>
            <h2 className="font-neue-montreal text-2xl md:text-3xl font-semibold text-white tracking-tight mb-2">
              What is your primary health goal?
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Our board-certified physicians customize your treatment plan based on your unique metabolic profile.
            </p>

            <div className="space-y-3">
              {[
                { id: "weight", title: "Sustainable Weight Loss", desc: "GLP-1/GIP treatments like Tirzepatide & Semaglutide", popular: true },
                { id: "wellness", title: "Daily Wellness & Energy", desc: "NAD+, vitamin therapies, and cellular health" },
                { id: "sexual", title: "Sexual Health & Performance", desc: "Discreet clinician consultations & effective remedies" },
                { id: "hair", title: "Hair Growth & Density", desc: "Custom compounded topical and oral formulations" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectGoal(opt.title)}
                  className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-neue-montreal font-semibold text-base text-white group-hover:text-emerald-300 transition-colors">
                        {opt.title}
                      </span>
                      {opt.popular && (
                        <span className="bg-emerald-950 text-emerald-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{opt.desc}</p>
                  </div>
                  <ArrowRight size={18} className="text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-neue-montreal text-2xl md:text-3xl font-semibold text-white tracking-tight mb-2">
              Have you used prescription GLP-1 medications before?
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Selected goal: <span className="text-emerald-400 font-medium">{goal}</span>
            </p>

            {isSubmitting ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-4" />
                <p className="font-neue-montreal text-lg text-white font-medium">Matching physician protocol...</p>
                <p className="text-xs text-gray-400 mt-1">Analyzing 500+ licensed compounding pharmacies</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { title: "No, I'm new to GLP-1 treatments", badge: "Beginner Friendly" },
                  { title: "Yes, currently taking Tirzepatide or Semaglutide", badge: "Dose Continuation" },
                  { title: "Yes, but stopped previously and want to restart", badge: "Restart Plan" }
                ].map((exp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectExperience(exp.title)}
                    className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-neue-montreal font-semibold text-base text-white group-hover:text-emerald-300 transition-colors">
                        {exp.title}
                      </span>
                      <span className="block text-xs text-emerald-400/80 mt-1">{exp.badge}</span>
                    </div>
                    <ArrowRight size={18} className="text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <CheckCircle2 size={20} />
              <span className="font-semibold text-sm">Optimal Protocol Matched</span>
            </div>

            <h2 className="font-neue-montreal text-2xl font-bold text-white mb-4">
              Your Recommended Treatment
            </h2>

            <div className="bg-white/5 border border-white/15 rounded-2xl p-4 flex items-center gap-4 mb-6">
              <div className="w-20 h-20 relative bg-emerald-950/40 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/images/tirzepatide.png"
                  alt="Compounded Tirzepatide Rx"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  98.4% Patient Satisfaction
                </span>
                <h3 className="font-neue-montreal text-lg font-bold text-white leading-snug">
                  Compounded Tirzepatide Rx
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  Dual GIP & GLP-1 receptor agonist designed for active weight management and metabolic health.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-emerald-400 flex-shrink-0" />
                <span className="text-xs text-gray-300">500+ Licensed US Pharmacies</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2.5">
                <Activity size={18} className="text-emerald-400 flex-shrink-0" />
                <span className="text-xs text-gray-300">Board-Certified Physician Review</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-[#5b7358] hover:bg-[#4a6047] text-white font-neue-montreal font-semibold text-base py-3.5 rounded-xl transition-all shadow-lg cursor-pointer text-center"
            >
              Start Free Online Visit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
