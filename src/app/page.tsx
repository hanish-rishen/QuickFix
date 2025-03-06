"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BlurText from "../blocks/TextAnimations/BlurText/BlurText";
import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  if (currentUser) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,transparent)] dark:[mask-image:linear-gradient(0deg,black,transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/30 via-transparent to-purple-400/30 animate-gradient" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-conic from-purple-500/40 via-blue-500/40 to-teal-500/40 blur-3xl opacity-30 animate-slow-spin" />

      {/* Enhanced Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-lg bg-white/[0.02] dark:bg-black/[0.02] shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl transform group-hover:rotate-45 transition-transform duration-300" />
                <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center text-xl font-bold">
                  Q
                </div>
              </div>
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                  QuickFix
                </span>
                <span className="inline-block ml-2 text-sm text-gray-600 dark:text-gray-400 font-normal animate-fade-in">
                  Beta
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/signin"
                className="relative px-6 py-2.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-all group"
              >
                Sign In
                <span className="absolute bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/signup"
                className="relative group px-6 py-2.5 overflow-hidden rounded-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:scale-[1.02]" />
                <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-400 to-purple-400 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <span className="relative text-white">Get Started</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-12">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-20" />
              <div className="relative">
                <BlurText
                  text="Repair Made Simple"
                  className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white leading-tight"
                  animateBy="words"
                  delay={100}
                />
              </div>
            </div>

            {/* Hero Section - Tagline */}
            <div className="flex justify-center items-center">
              <div className="w-full max-w-3xl mx-auto text-center">
                <BlurText
                  text="Instant Solutions, Local Experts, Sustainable Living, All in One Place"
                  className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mx-auto"
                  animateBy="words"
                  delay={200}
                  direction="bottom"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link
                href="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 text-lg font-medium"
              >
                Start Building Free
                <span className="ml-2 group-hover:ml-3 transition-all">→</span>
              </Link>
              <a
                href="#features"
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-gray-200/20 dark:border-white/10 text-gray-700 dark:text-gray-200 rounded-full transition-all hover:scale-105 hover:bg-white/20 text-lg font-medium"
              >
                See Features
              </a>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
              {[
                { number: "99%", label: "Satisfaction Rate" },
                { number: "24/7", label: "Live Support" },
                { number: "100k+", label: "Active Users" },
                { number: "50+", label: "Integrations" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-transparent to-purple-400/30 blur-3xl -z-10" />
            {[
              {
                title: "Lightning Fast",
                description: "Build and deploy in seconds, not hours",
                icon: "⚡",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                title: "Modern Stack",
                description: "Built with cutting-edge technologies",
                icon: "🚀",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                title: "Smart Integration",
                description: "Works with your favorite tools",
                icon: "🔄",
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl border border-gray-200/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all hover:scale-105"
              >
                <div
                  className={`inline-block p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white text-3xl`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
