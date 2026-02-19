import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Boxes,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  Download,
  GitBranch,
  GraduationCap,
  Lock,
  MessageSquareText,
  Network,
  Route,
  Share2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useCanonical } from "@/hooks/use-canonical";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

const capabilityCards = [
  {
    icon: MessageSquareText,
    title: "Prompt-to-diagram",
    description: "Describe any process, system, workflow, or plan in plain language and iterate conversationally.",
  },
  {
    icon: Network,
    title: "20+ diagram formats",
    description: "Flowcharts, sequence, ER, C4, timelines, mindmaps, Sankey and more.",
  },
  {
    icon: Code2,
    title: "Editable code first",
    description: "Inspect and edit Mermaid/Chart DSL directly, then re-render instantly.",
  },
  {
    icon: Sparkles,
    title: "Self-healing output",
    description: "Auto-sanitization and validation reduce broken diagram states.",
  },
  {
    icon: Share2,
    title: "Shareable reviews",
    description: "Generate links for async feedback without requiring account setup.",
  },
  {
    icon: Download,
    title: "Export-ready assets",
    description: "Move from ideation to docs and handoff with minimal friction.",
  },
];

const workflowSteps = [
  {
    id: "01",
    title: "Describe the problem",
    body: "Start with your context: product flow, ops process, architecture, research map, or decision tree.",
  },
  {
    id: "02",
    title: "Generate and refine",
    body: "Diagflo drafts the diagram, then you iterate with follow-up prompts or direct code edits.",
  },
  {
    id: "03",
    title: "Ship and share",
    body: "Export outputs, restore past versions, and share links for review or documentation.",
  },
];

const useCaseTracks = [
  {
    icon: GitBranch,
    title: "Engineering",
    body: "Architecture maps, sequence flows, API interactions, data models, and incident playbooks.",
  },
  {
    icon: Briefcase,
    title: "Product & Operations",
    body: "User journeys, process maps, handoff diagrams, SOP workflows, and planning artifacts.",
  },
  {
    icon: BarChart3,
    title: "Data & Analytics",
    body: "Pipeline overviews, metric flows, reporting logic, and explainable analysis diagrams.",
  },
  {
    icon: GraduationCap,
    title: "Education & Research",
    body: "Concept maps, lecture visuals, framework comparisons, and study-friendly diagrams.",
  },
];

const switchReasons = [
  {
    icon: Boxes,
    title: "Flexible by design",
    body: "Keep output in open, editable diagram formats that are easy to review and reuse.",
  },
  {
    icon: Route,
    title: "Built for iteration",
    body: "Chat, code editing, history restore, and retries are all in one continuous workspace.",
  },
  {
    icon: Lock,
    title: "Practical trust model",
    body: "Clear controls for local history, explicit sharing, and provider-bound key handling.",
  },
];

const dataHandling = [
  "Gemini mode uses your personal API key from browser settings.",
  "Shared links are created only when you explicitly publish.",
  "Local history stays in your browser storage.",
];

const LandingPage = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [heroReady, setHeroReady] = useState(false);
  useCanonical("/");

  const capabilitiesReveal = useReveal();
  const workflowReveal = useReveal();
  const trustReveal = useReveal();
  const ctaReveal = useReveal();

  useEffect(() => {
    document.title = "Diagflo — AI Diagram Workspace for Teams";
    const onThemeChange = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    window.addEventListener("theme-changed", onThemeChange);

    const t = requestAnimationFrame(() => setHeroReady(true));
    return () => {
      cancelAnimationFrame(t);
      window.removeEventListener("theme-changed", onThemeChange);
    };
  }, []);

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        isDark ? "bg-[#090a0f] text-[#f5f7fb]" : "bg-[#f4f6f8] text-[#111827]"
      }`}
    >
      <main id="main-content">
        <section
          className={`relative overflow-hidden border-b ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
          aria-labelledby="hero-heading"
        >
          <div className="pointer-events-none absolute inset-0">
            <div
              className={`absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl ${
                isDark ? "bg-orange-500/18" : "bg-orange-300/30"
              }`}
            />
            <div
              className={`absolute bottom-0 right-0 h-72 w-72 rounded-full blur-3xl ${
                isDark ? "bg-amber-500/10" : "bg-amber-200/35"
              }`}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pb-14 sm:pb-20 pt-20 sm:pt-24 lg:pt-28">
            <div className="grid min-w-0 items-center gap-8 sm:gap-12 lg:grid-cols-[1.15fr_0.85fr]">
              <div
                className={`min-w-0 transition-all duration-700 ${
                  heroReady
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <h1
                  id="hero-heading"
                  className="mt-4 sm:mt-5 text-4xl font-semibold tracking-tight leading-[1.03] sm:text-5xl lg:text-7xl"
                >
                  Turn complex ideas into clear diagrams.
                </h1>
                <p
                  className={`mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg leading-relaxed ${
                    isDark ? "text-white/70" : "text-black/65"
                  }`}
                >
                  Describe. Visualise. Done.
                </p>

                <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                  <Link
                    to="/app"
                    className={`w-full sm:w-auto justify-center inline-flex items-center gap-2 rounded-full px-5 sm:px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                      isDark
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-[#111827] text-white hover:bg-[#1f2937]"
                    }`}
                  >
                    Open Workspace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/docs"
                    className={`w-full sm:w-auto justify-center inline-flex items-center gap-2 rounded-full border px-5 sm:px-6 py-3 text-sm font-semibold transition-colors ${
                      isDark
                        ? "border-white/20 text-white/90 hover:bg-white/10"
                        : "border-black/15 text-black/80 hover:bg-black/5"
                    }`}
                  >
                    View Docs
                  </Link>
                </div>

                {/* <div className="mt-6 sm:mt-7 grid gap-2 sm:grid-cols-2">
                  <div
                    className={`inline-flex items-center gap-2 text-sm ${
                      isDark ? "text-white/70" : "text-black/65"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Bring your own API key
                  </div>
                </div> */}

                {/* <div className="mt-4 sm:mt-5 flex flex-wrap gap-2">
                  {["Engineering", "Product", "Operations", "Analytics", "Education"].map((track) => (
                    <span
                      key={track}
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
                        isDark
                          ? "border-white/15 bg-white/[0.04] text-white/75"
                          : "border-black/10 bg-white text-black/70"
                      }`}
                    >
                      {track}
                    </span>
                  ))}
                </div> */}
              </div>

              <div
                className={`min-w-0 transition-all duration-700 delay-100 ${
                  heroReady
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                <div
                  className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-xl ${
                    isDark
                      ? "border-white/10 bg-black/40"
                      : "border-black/10 bg-white/80"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
                      Live Preview
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] ${
                        isDark
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      <Clock3 className="h-3.5 w-3.5" />
                      ~8s render
                    </span>
                  </div>

                  <div
                    className={`mt-4 rounded-xl border p-3 text-sm ${
                      isDark
                        ? "border-white/10 bg-white/[0.03]"
                        : "border-black/10 bg-black/[0.03]"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      Prompt
                    </p>
                    <p className="break-words">
                      Map the customer onboarding workflow, including KYC checks, handoffs, and escalation paths.
                    </p>
                  </div>

                  <div
                    className={`mt-3 rounded-xl border p-3 ${
                      isDark
                        ? "border-white/10 bg-[#0b1016]"
                        : "border-black/10 bg-[#f8fafc]"
                    }`}
                  >
                    <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                      Output
                    </p>
                    <pre className="max-w-full overflow-x-auto whitespace-pre text-xs leading-relaxed">
                      <code>{`flowchart LR
  Lead["New Customer"] --> Verify["KYC + Verification"]
  Verify --> Account["Account Setup"]
  Account --> Success["Activation Complete"]
  Verify -. issue .-> Escalate["Manual Review Queue"]`}</code>
                    </pre>
                  </div>

                  <div className="mt-4 grid grid-cols-1 min-[420px]:grid-cols-3 gap-2 text-center">
                    <div
                      className={`rounded-lg border p-2 ${
                        isDark
                          ? "border-white/10 bg-white/[0.02]"
                          : "border-black/10 bg-white"
                      }`}
                    >
                      <p className="text-[11px] text-muted-foreground">Types</p>
                      <p className="text-sm font-semibold">20+</p>
                    </div>
                    <div
                      className={`rounded-lg border p-2 ${
                        isDark
                          ? "border-white/10 bg-white/[0.02]"
                          : "border-black/10 bg-white"
                      }`}
                    >
                      <p className="text-[11px] text-muted-foreground">Iterations</p>
                      <p className="text-sm font-semibold">Unlimited</p>
                    </div>
                    <div
                      className={`rounded-lg border p-2 ${
                        isDark
                          ? "border-white/10 bg-white/[0.02]"
                          : "border-black/10 bg-white"
                      }`}
                    >
                      <p className="text-[11px] text-muted-foreground">Exports</p>
                      <p className="text-sm font-semibold">Ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className={`py-14 sm:py-20 border-b ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div
            ref={capabilitiesReveal.ref}
            className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-700 ${
              capabilitiesReveal.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-7"
            }`}
          >
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">
                Built for real team workflows, not just demos.
              </h2>
              <p
                className={`mt-4 text-base sm:text-lg ${
                  isDark ? "text-white/70" : "text-black/65"
                }`}
              >
                Every part of the product is optimized for fast iteration, clean
                output, and fewer broken diagram states.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilityCards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                      : "border-black/10 bg-white hover:bg-[#fffaf5]"
                  }`}
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      isDark ? "text-white/65" : "text-black/60"
                    }`}
                  >
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="use-cases"
          className={`py-14 sm:py-20 border-b ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">
                Not just system design.
              </h2>
              <p
                className={`mt-4 text-base sm:text-lg ${
                  isDark ? "text-white/70" : "text-black/65"
                }`}
              >
                Teams use Diagflo for anything that benefits from clear, shareable visual logic.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {useCaseTracks.map((track) => (
                <div
                  key={track.title}
                  className={`rounded-2xl border p-5 ${
                    isDark
                      ? "border-white/10 bg-white/[0.03]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                    <track.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{track.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-white/65" : "text-black/60"}`}>
                    {track.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className={`py-14 sm:py-20 border-b ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div
            ref={workflowReveal.ref}
            className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-700 ${
              workflowReveal.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-7"
            }`}
          >
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">
                From rough idea to shippable artifact in three steps.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {workflowSteps.map((step) => (
                <div
                  key={step.id}
                  className={`rounded-2xl border p-6 ${
                    isDark
                      ? "border-white/10 bg-black/35"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-widest ${
                      isDark
                        ? "bg-orange-500/15 text-orange-300"
                        : "bg-orange-50 text-orange-700"
                    }`}
                  >
                    STEP {step.id}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      isDark ? "text-white/65" : "text-black/60"
                    }`}
                  >
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="security"
          className={`py-14 sm:py-20 border-b ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div
            ref={trustReveal.ref}
            className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-700 ${
              trustReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
            }`}
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
              <div>
                <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">
                  Transparent by default.
                </h2>
                <p
                  className={`mt-4 text-base sm:text-lg ${
                    isDark ? "text-white/70" : "text-black/65"
                  }`}
                >
                  Clear boundaries on where data lives and when it is shared.
                </p>

                <div className="mt-6 space-y-3">
                  {dataHandling.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <p className={isDark ? "text-white/70" : "text-black/65"}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`rounded-2xl border p-6 ${
                  isDark
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-black/10 bg-white"
                }`}
              >
                <h3 className="text-lg font-semibold">Operational posture</h3>
                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Credential isolation</p>
                      <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
                        API credentials are scoped to provider mode and explicit user configuration.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Controlled persistence</p>
                      <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
                        Local history is browser-bound; remote persistence occurs only for deliberate sharing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`py-14 sm:py-20 border-b ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">
                Why teams pick Diagflo over generic tools.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {switchReasons.map((reason) => (
                <div
                  key={reason.title}
                  className={`rounded-2xl border p-6 ${
                    isDark
                      ? "border-white/10 bg-black/35"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                    <reason.icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{reason.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-white/65" : "text-black/60"}`}>
                    {reason.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div
            ref={ctaReveal.ref}
            className={`mx-auto max-w-5xl px-4 sm:px-6 transition-all duration-700 ${
              ctaReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
            }`}
          >
            <div
              className={`rounded-3xl border p-6 sm:p-10 text-center ${
                isDark
                  ? "border-white/10 bg-gradient-to-b from-[#131923] to-[#0b0f15]"
                  : "border-black/10 bg-gradient-to-b from-[#fff9f2] to-white"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                Ready To Build
              </p>
              <h2 className="mt-3 text-2xl sm:text-5xl font-semibold tracking-tight">
                Create your next diagram in minutes.
              </h2>
              <p
                className={`mx-auto mt-4 max-w-2xl text-base sm:text-lg ${
                  isDark ? "text-white/70" : "text-black/65"
                }`}
              >
                Start with a prompt, iterate with confidence, and ship diagrams that stay editable.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/app"
                  className={`w-full sm:w-auto justify-center inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                    isDark
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-[#111827] text-white hover:bg-[#1f2937]"
                  }`}
                >
                  Launch App
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/pricing"
                  className={`w-full sm:w-auto justify-center inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold ${
                    isDark
                      ? "border-white/20 text-white/90 hover:bg-white/10"
                      : "border-black/15 text-black/80 hover:bg-black/5"
                  }`}
                >
                  Compare Plans
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer
          className={`border-t ${
            isDark ? "border-white/10" : "border-black/10"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link
                to="/privacy"
                className={isDark ? "text-white/65 hover:text-white" : "text-black/65 hover:text-black"}
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className={isDark ? "text-white/65 hover:text-white" : "text-black/65 hover:text-black"}
              >
                Terms
              </Link>
              <a
                href="https://github.com/itsyashvardhan/diagflo"
                target="_blank"
                rel="noopener noreferrer"
                className={isDark ? "text-white/65 hover:text-white" : "text-black/65 hover:text-black"}
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/diagflo"
                target="_blank"
                rel="noopener noreferrer"
                className={isDark ? "text-white/65 hover:text-white" : "text-black/65 hover:text-black"}
              >
                LinkedIn
              </a>
            </div>
            <p className={isDark ? "text-white/55 text-sm" : "text-black/55 text-sm"}>
              © {new Date().getFullYear()} Diagflo
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
