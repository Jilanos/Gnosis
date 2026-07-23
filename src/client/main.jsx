import React from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clock3,
  Copy,
  Download,
  KeyRound,
  Loader2,
  Moon,
  Play,
  Sparkles,
  Sun,
} from "lucide-react";
import "./styles.css";

const DEFAULT_TOPICS = `DNS
TCP handshake
IPv4 / IPv6
NAT
CIDR
TLS
reverse proxy
Docker
CI/CD
observabilite`;

const GENERATION_TIMEOUT_MS = 120_000;

const LEVELS = [
  { value: "debutant", label: "Debutant" },
  { value: "intermediaire", label: "Intermediaire" },
  { value: "avance", label: "Avance" },
];

function splitTopics(text) {
  return text
    .split(/[\n,;]+/)
    .map((topic) => topic.trim())
    .filter(Boolean);
}

function slugDownloadName(deck) {
  return `${deck?.id || "deck-gnosis"}.json`;
}

function prefersDark() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return !window.matchMedia("(prefers-color-scheme: light)").matches;
}

function useTheme() {
  const [theme, setTheme] = React.useState(() => (prefersDark() ? "dark" : "light"));

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = React.useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle];
}

// Fond animé : nébuleuse dérivante + champ d'étoiles (respecte prefers-reduced-motion).
function Sky({ theme }) {
  const canvasRef = React.useRef(null);
  const themeRef = React.useRef(theme);
  themeRef.current = theme;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let stars = [];
    let elapsed = 0;
    let frame = 0;

    const blobs = [
      { x: 0.22, y: 0.18, r: 0.55, hue: [94, 234, 212] },
      { x: 0.82, y: 0.3, r: 0.5, hue: [71, 199, 245] },
      { x: 0.6, y: 0.85, r: 0.6, hue: [139, 156, 240] },
    ];

    function isLight() {
      return themeRef.current === "light";
    }

    function init() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(140, Math.floor((width * height) / 13000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.3,
        a: Math.random() * 0.5 + 0.2,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function draw() {
      const light = isLight();
      ctx.clearRect(0, 0, width, height);

      blobs.forEach((bl, b) => {
        const drift = reduce ? 0 : Math.sin(elapsed * 0.0004 + b * 2) * 0.04;
        const cx = (bl.x + drift) * width;
        const cy = (bl.y + Math.cos(elapsed * 0.0003 + b) * 0.03) * height;
        const rad = bl.r * Math.max(width, height) * 0.6;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        const op = light ? 0.14 : 0.2;
        grad.addColorStop(0, `rgba(${bl.hue[0]}, ${bl.hue[1]}, ${bl.hue[2]}, ${op})`);
        grad.addColorStop(1, `rgba(${bl.hue[0]}, ${bl.hue[1]}, ${bl.hue[2]}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      const starColor = light ? "20, 80, 90" : "190, 230, 240";
      stars.forEach((s) => {
        const tw = reduce ? 1 : Math.sin(elapsed * 0.002 + s.tw) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starColor}, ${s.a * tw})`;
        ctx.fill();
      });

      if (!reduce) {
        elapsed += 16;
        frame = window.requestAnimationFrame(draw);
      }
    }

    function handleResize() {
      init();
      if (reduce) draw();
    }

    init();
    draw();
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas id="sky" ref={canvasRef} aria-hidden="true" />;
}

function App() {
  const [theme, toggleTheme] = useTheme();
  const [topicsText, setTopicsText] = React.useState(DEFAULT_TOPICS);
  const [options, setOptions] = React.useState({
    title: "",
    language: "francais",
    level: "intermediaire",
    density: "dense",
    targetCards: 8,
  });
  const [apiKey, setApiKey] = React.useState("");
  const [state, setState] = React.useState({ status: "idle" });
  const [copied, setCopied] = React.useState(false);

  const topics = splitTopics(topicsText);
  const deck = state.result?.deck;
  const plan = state.result?.plan;
  const metrics = state.result?.metrics;
  const pipeline = state.result?.pipeline ?? [];

  async function generateDeck() {
    setCopied(false);
    setState({ status: "loading" });
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), GENERATION_TIMEOUT_MS);
    try {
      const response = await fetch("/api/generate-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          topics,
          options,
          apiKey: apiKey.trim(),
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || "Generation impossible.");
      }
      setState({ status: "done", result: body });
    } catch (error) {
      const message =
        error.name === "AbortError"
          ? "Generation interrompue: le delai maximal de 120 secondes est depasse."
          : error.message;
      setState({ status: "error", error: message });
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function updateOption(key, value) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  function downloadDeck() {
    if (!deck) return;
    const blob = new Blob([JSON.stringify(deck, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = slugDownloadName(deck);
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyDeck() {
    if (!deck) return;
    await navigator.clipboard.writeText(JSON.stringify(deck, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <Sky theme={theme} />
      <div className="vignette" aria-hidden="true" />

      <main className="shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">
              <Brain size={19} />
            </span>
            <div>
              <strong>Gnosis</strong>
              <span className="sub">Generateur de decks Kapsule</span>
            </div>
          </div>

          <div className="mini-metrics" aria-label="Resume du pipeline">
            <span className="mm">
              <span className="v">{topics.length}</span>
              <span className="l">sujets</span>
            </span>
            <span className="mm">
              <span className="v">{options.targetCards}</span>
              <span className="l">fiches</span>
            </span>
            <span className="mm">
              <span className="v">v1</span>
              <span className="l">Kapsule</span>
            </span>
          </div>

          <div className="topbar-right">
            <span className="status-pill">
              <span className="dot" />
              Pipeline OpenAI
            </span>
            <button
              className="theme-toggle"
              type="button"
              title="Basculer le theme"
              aria-label="Basculer le theme"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
          </div>
        </header>

        <section className="workspace">
          <form className="surface" onSubmit={(event) => event.preventDefault()}>
            <div className="surface-head">
              <div>
                <h2>Entrée</h2>
                <span className="hint">Une notion par ligne, ou separees par virgules.</span>
              </div>
              <button
                className="icon-btn"
                type="button"
                title="Reinitialiser l'exemple"
                aria-label="Reinitialiser l'exemple"
                onClick={() => setTopicsText(DEFAULT_TOPICS)}
              >
                <Sparkles size={16} />
              </button>
            </div>

            <div className="scroll">
              <label className="field">
                <span className="flabel">Titre du deck</span>
                <input
                  value={options.title}
                  placeholder="Ex. Reseaux et deploiement web"
                  onChange={(event) => updateOption("title", event.target.value)}
                />
              </label>

              <label className="field">
                <span className="flabel">Sujets techniques</span>
                <textarea
                  value={topicsText}
                  rows={7}
                  onChange={(event) => setTopicsText(event.target.value)}
                />
              </label>

              <div className="chips" aria-label="Sujets detectes">
                {topics.slice(0, 12).map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
                {topics.length > 12 && <span className="more">+{topics.length - 12}</span>}
              </div>

              <div className="settings-grid">
                <label className="field">
                  <span className="flabel">Langue</span>
                  <select
                    value={options.language}
                    onChange={(event) => updateOption("language", event.target.value)}
                  >
                    <option value="francais">Francais</option>
                    <option value="anglais">Anglais</option>
                  </select>
                </label>

                <label className="field">
                  <span className="flabel">Niveau</span>
                  <select
                    value={options.level}
                    onChange={(event) => updateOption("level", event.target.value)}
                  >
                    {LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span className="flabel">Densite</span>
                  <select
                    value={options.density}
                    onChange={(event) => updateOption("density", event.target.value)}
                  >
                    <option value="concise">Concise</option>
                    <option value="dense">Dense</option>
                    <option value="maximale">Maximale</option>
                  </select>
                </label>

                <label className="field">
                  <span className="flabel">Fiches ciblees</span>
                  <input
                    type="number"
                    min="2"
                    max="24"
                    value={options.targetCards}
                    onChange={(event) => updateOption("targetCards", Number(event.target.value))}
                  />
                </label>
              </div>

              <label className="field" style={{ marginBottom: 0 }}>
                <span className="flabel">Cle API OpenAI</span>
                <div className="input-icon">
                  <KeyRound size={15} />
                  <input
                    type="password"
                    value={apiKey}
                    placeholder="sk-..."
                    autoComplete="off"
                    spellCheck={false}
                    onChange={(event) => setApiKey(event.target.value)}
                  />
                </div>
              </label>
            </div>

            <div className="control-foot">
              <button
                className="primary"
                type="button"
                disabled={state.status === "loading" || topics.length === 0}
                onClick={generateDeck}
              >
                {state.status === "loading" ? (
                  <Loader2 className="spin" size={17} />
                ) : (
                  <Play size={17} />
                )}
                Generer le deck
              </button>
            </div>
          </form>

          <section className="surface">
            <div className="surface-head">
              <div>
                <h2>Sortie</h2>
                <span className="hint">Plan intermediaire, validation et JSON Kapsule.</span>
              </div>
              <div className="head-actions">
                <button
                  className="icon-btn"
                  type="button"
                  title="Copier le JSON"
                  disabled={!deck}
                  onClick={copyDeck}
                >
                  <Copy size={16} />
                </button>
                <button
                  className="icon-btn"
                  type="button"
                  title="Telecharger le deck"
                  disabled={!deck}
                  onClick={downloadDeck}
                >
                  <Download size={16} />
                </button>
              </div>
            </div>

            <div className="scroll">
              {state.status === "idle" && <EmptyState />}
              {state.status === "loading" && <LoadingState />}
              {state.status === "error" && <ErrorState message={state.error} />}
              {state.status === "done" && (
                <DeckResult
                  deck={deck}
                  plan={plan}
                  metrics={metrics}
                  pipeline={pipeline}
                  validation={state.result.validation}
                  copied={copied}
                />
              )}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

function EmptyState() {
  return (
    <div className="state">
      <Brain size={34} />
      <h3>Le pipeline attend tes sujets.</h3>
      <p>
        La generation passe par normalisation, familles, expansion, plan, fiches et validation
        Kapsule.
      </p>
    </div>
  );
}

function LoadingState() {
  const steps = ["Normalisation", "Familles", "Expansion", "Plan", "Fiches", "Validation"];
  return (
    <div className="state">
      <Loader2 className="spin" size={32} />
      <h3>Generation en cours</h3>
      <div className="step-list">
        {steps.map((step) => (
          <span key={step}>{step}</span>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="state is-error">
      <AlertTriangle size={32} />
      <h3>Generation interrompue</h3>
      <p>{message}</p>
    </div>
  );
}

function DeckResult({ deck, plan, metrics, pipeline, validation, copied }) {
  return (
    <div className="deck-result">
      <div className="banner">
        <CheckCircle2 size={17} />
        {validation?.valid ? "Deck valide Kapsule" : "Deck genere avec avertissements"}
        {copied && <span className="tag">JSON copie</span>}
      </div>

      {pipeline.length > 0 && (
        <div className="pipeline">
          {pipeline.map((step, index) => (
            <div key={step.name} className="pcard">
              <span className="step-no">{String(index + 1).padStart(2, "0")}</span>
              <span className="step-name">{step.name}</span>
              <span className="step-sum">{step.summary}</span>
            </div>
          ))}
        </div>
      )}

      {plan?.cards?.length > 0 && (
        <div className="panel plan">
          <h3>Plan pedagogique</h3>
          <ol>
            {plan.cards.map((card, index) => (
              <li key={card.id || card.title}>
                <span className="num">{index + 1}</span>
                <div>
                  <strong>{card.title}</strong>
                  <span>{card.objective}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="panel deck-preview">
        <div>
          <h3>{deck.title}</h3>
          <p>{deck.description}</p>
        </div>
        <span className="badge">{deck.cards.length} fiches</span>
      </div>

      {metrics?.cards?.length > 0 && (
        <div className="panel">
          <div className="metrics-head">
            <h3>Calibrage des fiches</h3>
            <span className="total">
              <Clock3 size={14} />
              {metrics.totalWords} mots / {metrics.totalDurationMin} min
            </span>
          </div>
          <div className="mlist">
            {metrics.cards.map((card) => (
              <div
                key={card.cardId || card.title}
                className={card.belowMinimum ? "mrow short" : "mrow"}
              >
                <strong>{card.title}</strong>
                <span className={card.belowMinimum ? "m flag" : "m"}>{card.wordCount} mots</span>
                <span className="m">{card.questionCount} quiz</span>
                <span className="m">{card.schemaDurationMin} min</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <pre className="json">{JSON.stringify(deck, null, 2)}</pre>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
