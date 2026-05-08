/**
 * Home Page (Landing)
 * 
 * The primary entry point for the Bio-Heritage AI platform.
 * Orchestrates the integration of specialized research components 
 * from all 4 research team members.
 */

import RagSection from "@/components/features/member1/RagSection";
import IntentSection from "@/components/features/member2/IntentSection";
import ExplainSection from "@/components/features/member3/ExplainSection";
import GatewaySection from "@/components/features/member4/GatewaySection";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-24">
      {/* 
        Hero Section: 
        Visual introduction with a radial gradient aesthetic for a premium feel.
      */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-zinc-50 py-24 text-center dark:bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-transparent dark:from-emerald-900/10"></div>
        <div className="container relative z-10 px-4">
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Preserving Sri Lankan <span className="text-emerald-600 dark:text-emerald-400">Indigenous Medical</span> Knowledge
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl text-zinc-600 dark:text-zinc-400">
            A Multi-Modal AI framework designed to digitize, interpret, and preserve ancient medical manuscripts for future generations.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button className="rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-lg dark:bg-emerald-500">
              Explore Research
            </button>
            <button className="rounded-full border border-zinc-200 bg-white px-8 py-3 font-semibold transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">
              View Datasets
            </button>
          </div>
        </div>
      </section>

      {/* 
        Team Contributions Section: 
        Displays the 4 specialized AI modules developed by each team member.
      */}
      <section className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Core Framework Components</h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Developed by our 4-member research team, each specializing in a critical AI domain.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <RagSection />
          <IntentSection />
          <ExplainSection />
          <GatewaySection />
        </div>
      </section>

      {/* Mission / Objective Statement */}
      <section className="bg-zinc-50 py-20 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">Research Objective</h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
            Our goal is to create a bridge between ancient wisdom and modern technology, 
            ensuring that the heritage of Sri Lankan Indigenous Medicine (Ayurveda/Deshiya Chikitsa) 
            is accurately documented and accessible through cutting-edge AI.
          </p>
        </div>
      </section>
    </div>
  );
}


