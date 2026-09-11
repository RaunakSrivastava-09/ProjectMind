import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080a0f] text-white">
    
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-180px] h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[150px]" />

        <div className="absolute bottom-[-200px] left-[-100px] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      <nav className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-600/20">
              P
            </div>

            <div>
              <h1 className="font-bold">
                ProjectMind
              </h1>

              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600">
                AI Project Assistant
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            Open Dashboard
          </Link>
        </div>
      </nav>

      
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-81px)] max-w-6xl items-center px-5 py-20 md:px-8">
        <div className="w-full">
      
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-2 text-xs font-medium text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Voice-to-Command Project Assistant
          </div>

         
          <h2 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            What if you could
            <span className="block text-blue-500">
              talk to your project?
            </span>
          </h2>

         
          <p className="mt-7 max-w-2xl text-base leading-7 text-gray-400 md:text-lg">
            ProjectMind turns natural language into
            real project actions. Create tasks, report
            snags, search project information, and get
            project status without navigating through
            endless screens and forms.
          </p>

       
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-xl bg-blue-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Talk to your project →
            </Link>

            <a
              href="#how-it-works"
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-center text-sm font-medium text-gray-300 transition hover:bg-white/10"
            >
              See how it works
            </a>
          </div>

         
          <div className="mt-14 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                🎙️
              </span>

              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Example command
              </span>
            </div>

            <p className="text-sm leading-7 text-gray-300 md:text-base">
              "Create a snag for the master bathroom
              ceiling and assign it to the false-ceiling
              contractor."
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Tag text="CREATE_SNAG" />
              <Tag text="Master Bathroom Ceiling" />
              <Tag text="False-ceiling Contractor" />
              <Tag text="Confirmation Required" />
            </div>
          </div>

         
          <div
            id="how-it-works"
            className="mt-24"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-600">
              How it works
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <Step
                number="01"
                icon="🎙️"
                title="Speak"
                description="Give a natural voice command."
              />

              <Step
                number="02"
                icon="🧠"
                title="Understand"
                description="AI identifies your intent and entities."
              />

              <Step
                number="03"
                icon="✓"
                title="Confirm"
                description="Review important actions before execution."
              />

              <Step
                number="04"
                icon="⚡"
                title="Execute"
                description="ProjectMind performs the real project action."
              />
            </div>
          </div>

        
          <div className="mt-20">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-600">
              Capabilities
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Capability
                icon="📋"
                title="Task Creation"
              />

              <Capability
                icon="⚠️"
                title="Snag Reporting"
              />

              <Capability
                icon="🔎"
                title="Voice Search"
              />

              <Capability
                icon="📊"
                title="Project Status"
              />
            </div>
          </div>

        
          <footer className="mt-20 border-t border-white/10 pt-6">
            <div className="flex flex-col justify-between gap-3 text-xs text-gray-600 sm:flex-row">
              <p>
                ProjectMind — Less clicking. More doing.
              </p>

              <p>
                Built for AS-03 Hackathon Challenge
              </p>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}

function Tag({ text }) {
  return (
    <span className="rounded-lg border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-gray-500">
      {text}
    </span>
  );
}

function Step({
  number,
  icon,
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-blue-500">
          {number}
        </span>

        <span className="text-lg">
          {icon}
        </span>
      </div>

      <h3 className="mt-6 font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Capability({ icon, title }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <span className="text-lg">
        {icon}
      </span>

      <span className="text-sm text-gray-300">
        {title}
      </span>
    </div>
  );
}