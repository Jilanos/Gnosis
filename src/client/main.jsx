import React from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  CheckCircle2,
  Copy,
  Download,
  FileJson,
  Layers3,
  Loader2,
  Network,
  Play,
  Sparkles,
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

function App() {
  const [topicsText, setTopicsText] = React.useState(DEFAULT_TOPICS);
  const [options, setOptions] = React.useState({
    title: "",
    language: "francais",
    level: "intermediaire",
    density: "dense",
    targetCards: 8,
  });
  const [state, setState] = React.useState({ status: "idle" });
  const [copied, setCopied] = React.useState(false);

  const topics = splitTopics(topicsText);
  const deck = state.result?.deck;
  const plan = state.result?.plan;
  const pipeline = state.result?.pipeline ?? [];

  async function generateDeck() {
    setCopied(false);
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/generate-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topics,
          options,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || "Generation impossible.");
      }
      setState({ status: "done", result: body });
    } catch (error) {
      setState({ status: "error", error: error.message });
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
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <Brain size={22} />
          </span>
          <div>
            <strong>Gnosis</strong>
            <span>Generateur de decks Kapsule</span>
          </div>
        </div>
        <div className="status-pill">
          <Network size={16} />
          Pipeline OpenAI structure
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Apprentissage technique structure</p>
          <h1>Transforme des notions brutes en fiches Kapsule completes.</h1>
          <p>
            Colle une liste de sujets, laisse Gnosis les organiser en familles,
            enrichir les notions proches, puis generer un deck valide avec quiz.
          </p>
        </div>
        <div className="hero-panel" aria-label="Resume du pipeline">
          <div className="metric">
            <Layers3 size={20} />
            <span>{topics.length}</span>
            <small>sujets detectes</small>
          </div>
          <div className="metric">
            <BookOpen size={20} />
            <span>{options.targetCards}</span>
            <small>fiches ciblees</small>
          </div>
          <div className="metric">
            <FileJson size={20} />
            <span>v1</span>
            <small>schema Kapsule</small>
          </div>
        </div>
      </section>

      <section className="workspace">
        <form className="control-surface" onSubmit={(event) => event.preventDefault()}>
          <div className="surface-head">
            <div>
              <h2>Entrée</h2>
              <p>Une notion par ligne, ou separees par virgules.</p>
            </div>
            <button
              className="icon-button"
              type="button"
              title="Reinitialiser l'exemple"
              onClick={() => setTopicsText(DEFAULT_TOPICS)}
            >
              <Sparkles size={18} />
            </button>
          </div>

          <label className="field">
            <span>Titre du deck</span>
            <input
              value={options.title}
              placeholder="Ex. Reseaux et deploiement web"
              onChange={(event) => updateOption("title", event.target.value)}
            />
          </label>

          <label className="field">
            <span>Sujets techniques</span>
            <textarea
              value={topicsText}
              rows={14}
              onChange={(event) => setTopicsText(event.target.value)}
            />
          </label>

          <div className="chips" aria-label="Sujets detectes">
            {topics.slice(0, 18).map((topic) => (
              <span key={topic}>{topic}</span>
            ))}
            {topics.length > 18 && <span>+{topics.length - 18}</span>}
          </div>

          <div className="settings-grid">
            <label className="field">
              <span>Langue</span>
              <select
                value={options.language}
                onChange={(event) => updateOption("language", event.target.value)}
              >
                <option value="francais">Francais</option>
                <option value="anglais">Anglais</option>
              </select>
            </label>

            <label className="field">
              <span>Niveau</span>
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
              <span>Densite</span>
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
              <span>Fiches ciblees</span>
              <input
                type="number"
                min="2"
                max="24"
                value={options.targetCards}
                onChange={(event) => updateOption("targetCards", Number(event.target.value))}
              />
            </label>
          </div>

          <button
            className="primary"
            type="button"
            disabled={state.status === "loading" || topics.length === 0}
            onClick={generateDeck}
          >
            {state.status === "loading" ? <Loader2 className="spin" size={18} /> : <Play size={18} />}
            Generer le deck
          </button>
        </form>

        <section className="result-surface">
          <div className="surface-head">
            <div>
              <h2>Sortie</h2>
              <p>Plan intermediaire, validation et JSON Kapsule.</p>
            </div>
            <div className="actions">
              <button className="icon-button" type="button" title="Copier le JSON" disabled={!deck} onClick={copyDeck}>
                <Copy size={18} />
              </button>
              <button className="icon-button" type="button" title="Telecharger le deck" disabled={!deck} onClick={downloadDeck}>
                <Download size={18} />
              </button>
            </div>
          </div>

          {state.status === "idle" && <EmptyState />}
          {state.status === "loading" && <LoadingState />}
          {state.status === "error" && <ErrorState message={state.error} />}
          {state.status === "done" && (
            <DeckResult
              deck={deck}
              plan={plan}
              pipeline={pipeline}
              validation={state.result.validation}
              copied={copied}
            />
          )}
        </section>
      </section>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <Brain size={38} />
      <h3>Le pipeline attend tes sujets.</h3>
      <p>
        La generation passe par normalisation, familles, expansion, plan, fiches
        et validation Kapsule.
      </p>
    </div>
  );
}

function LoadingState() {
  const steps = ["Normalisation", "Familles", "Expansion", "Plan", "Fiches", "Validation"];
  return (
    <div className="loading-state">
      <Loader2 className="spin" size={34} />
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
    <div className="error-state">
      <AlertTriangle size={34} />
      <h3>Generation interrompue</h3>
      <p>{message}</p>
    </div>
  );
}

function DeckResult({ deck, plan, pipeline, validation, copied }) {
  return (
    <div className="deck-result">
      <div className="validation-banner">
        <CheckCircle2 size={18} />
        {validation?.valid ? "Deck valide Kapsule" : "Deck genere avec avertissements"}
        {copied && <strong>JSON copie</strong>}
      </div>

      <div className="pipeline-grid">
        {pipeline.map((step) => (
          <div key={step.name} className="pipeline-card">
            <span>{step.name}</span>
            <strong>{step.summary}</strong>
          </div>
        ))}
      </div>

      {plan?.cards?.length > 0 && (
        <div className="plan-panel">
          <h3>Plan pedagogique</h3>
          <ol>
            {plan.cards.map((card) => (
              <li key={card.id || card.title}>
                <strong>{card.title}</strong>
                <span>{card.objective}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="deck-preview">
        <div>
          <h3>{deck.title}</h3>
          <p>{deck.description}</p>
        </div>
        <span>{deck.cards.length} fiches</span>
      </div>

      <pre className="json-preview">{JSON.stringify(deck, null, 2)}</pre>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

