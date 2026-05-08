"use client";

import { useState, useCallback } from "react";
import { Leaf, Camera, Upload, Microscope, Info } from "lucide-react";
import ImageUploader from "@/components/features/member3(Sahan)/ImageUploader";
import CameraCapture from "@/components/features/member3(Sahan)/CameraCapture";
import ResultDisplay, { AnalysisResult } from "@/components/features/member3(Sahan)/ResultDisplay";

type Tab = "upload" | "camera";
type State = "idle" | "analyzing" | "done";

// ── Mock analysis — replace with your real API call ──────────────────────────
async function analyzeLeaf(_file: File): Promise<AnalysisResult> {
    await new Promise((r) => setTimeout(r, 2800)); // simulate network
    const spread = Math.random() * 60;
    const quality =
        spread < 15 ? "High Quality" : spread < 40 ? "Medium Quality" : "Rejected";
    return {
        diseaseName: ["Leaf Spot", "Rust", "Powdery Mildew", "Healthy"][
            Math.floor(Math.random() * 4)
        ],
        diseaseSpreadPercent: parseFloat(spread.toFixed(2)),
        healthyTissuePercent: parseFloat((100 - spread).toFixed(2)),
        qualityStatus: quality,
    };
}
// ─────────────────────────────────────────────────────────────────────────────

export default function PlantDiseaseDetectionPage() {
    const [tab, setTab] = useState<Tab>("upload");
    const [showCamera, setShowCamera] = useState(false);
    const [state, setState] = useState<State>("idle");
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [currentFile, setCurrentFile] = useState<File | null>(null);

    const handleImageReady = useCallback(async (file: File, prev: string) => {
        setCurrentFile(file);
        setPreview(prev);
        setShowCamera(false);
        setState("analyzing");
        try {
            const res = await analyzeLeaf(file);
            setResult(res);
            setState("done");
        } catch {
            setState("idle");
            alert("Analysis failed. Please try again.");
        }
    }, []);

    const reset = () => {
        setState("idle");
        setPreview(null);
        setResult(null);
        setCurrentFile(null);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black">
            {/* ── Page Header ── */}
            <div className="relative overflow-hidden bg-black dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-100/30 via-transparent to-transparent dark:from-emerald-900/10 pointer-events-none" />
                <div className="container relative mx-auto px-4 py-14">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                            <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                            Member 3 · Sahan · IT22553478
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-zinc-900 dark:text-zinc-50">
                        Medicinal Plant{" "}
                        <span className="text-emerald-600 dark:text-emerald-400">Disease Detection</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                        Upload or capture a medicinal leaf image. Our dual-stage AI (EfficientNetB4 +
                        U-Net) classifies the disease and calculates an exact{" "}
                        <strong className="text-zinc-800 dark:text-zinc-200">Medicinal Quality Score</strong>.
                    </p>

                    {/* Info pills */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        {[
                            { icon: <Microscope className="h-3.5 w-3.5" />, text: "EfficientNetB4 Classifier" },
                            { icon: <Info className="h-3.5 w-3.5" />, text: "U-Net Pixel Segmentation" },
                            { icon: <Leaf className="h-3.5 w-3.5" />, text: "Precision Quality Grading" },
                        ].map((p) => (
                            <span
                                key={p.text}
                                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
                            >
                                {p.icon} {p.text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="container mx-auto px-4 py-10">
                <div className="mx-auto max-w-3xl">
                    {state === "idle" && (
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            {/* Tabs */}
                            <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800 mb-6">
                                {(["upload", "camera"] as Tab[]).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTab(t)}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${tab === t
                                            ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50"
                                            : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                            }`}
                                    >
                                        {t === "upload" ? <Upload className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                                        {t === "upload" ? "Upload Image" : "Use Camera"}
                                    </button>
                                ))}
                            </div>

                            {tab === "upload" ? (
                                <ImageUploader onImageSelected={handleImageReady} />
                            ) : (
                                <div className="flex flex-col items-center gap-4 py-10">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                                        <Camera className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                                            Open Camera
                                        </p>
                                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                            Capture a real-time photo of the medicinal leaf
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowCamera(true)}
                                        className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors dark:bg-emerald-500 dark:hover:bg-emerald-600"
                                    >
                                        Open Camera
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {state === "analyzing" && preview && (
                        <div className="flex flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="relative h-48 w-48 overflow-hidden rounded-xl">
                                <img src={preview} alt="Analyzing" className="h-full w-full object-cover opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Analyzing Leaf...</p>
                                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                    Running EfficientNetB4 classification &amp; U-Net segmentation
                                </p>
                            </div>
                            {/* Step indicators */}
                            <div className="flex flex-col gap-2 w-full max-w-xs">
                                {["Preprocessing image", "Classifying disease (EfficientNetB4)", "Segmenting affected area (U-Net)", "Calculating quality score"].map(
                                    (step, i) => (
                                        <div key={step} className="flex items-center gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                                            <span className="text-xs text-zinc-500 dark:text-zinc-400">{step}</span>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {state === "done" && result && preview && (
                        <ResultDisplay result={result} originalImage={preview} onReset={reset} />
                    )}
                </div>
            </div>

            {/* Camera modal */}
            {showCamera && (
                <CameraCapture onCapture={handleImageReady} onClose={() => setShowCamera(false)} />
            )}
        </div>
    );
}