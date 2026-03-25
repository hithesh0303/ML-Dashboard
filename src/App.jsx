import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
} from "recharts";

// ─── LIGHT THEME ──────────────────────────────────────────────────────────────
const T = {
  bg:       "#f7f3ec",
  panel:    "#ffffff",
  card:     "#fdfaf4",
  border:   "#e4d9c4",
  borderMd: "#cfc0a0",
  accent:   "#c47a1e",
  accentBg: "#fdf3e0",
  accentDim:"#e8c07a",
  text:     "#1c1408",
  sub:      "#5a4a2e",
  muted:    "#9e8a68",
  success:  "#2e7d52",
  warn:     "#c0440a",
  mono:     "'JetBrains Mono', monospace",
  sans:     "'Syne', sans-serif",
};

// ─── MODEL DATA ───────────────────────────────────────────────────────────────
const MODEL_RESULTS = {
  "Random Forest": {
    accuracy: 96.42, precision: 96.38, recall: 96.29, f1: 96.31,
    trainTime: 4.21, predTime: 18.3, color: "#c47a1e",
    perClass: [
      { act: "WALKING",      f1: 97.9, precision: 98.1, recall: 97.8 },
      { act: "W_UPSTAIRS",   f1: 94.9, precision: 95.2, recall: 94.6 },
      { act: "W_DOWNSTAIRS", f1: 95.4, precision: 94.8, recall: 96.1 },
      { act: "SITTING",      f1: 97.1, precision: 97.3, recall: 96.9 },
      { act: "STANDING",     f1: 97.2, precision: 97.1, recall: 97.4 },
      { act: "LAYING",       f1: 99.8, precision: 99.8, recall: 99.9 },
    ],
    cm: [
      [491,3,1,0,1,0],[8,453,10,0,0,0],[4,10,406,0,0,0],
      [0,0,0,477,14,0],[0,0,0,10,522,0],[0,0,0,0,0,537],
    ],
  },
  "Decision Tree": {
    accuracy: 87.31, precision: 87.14, recall: 87.05, f1: 87.08,
    trainTime: 0.54, predTime: 2.1, color: "#b03a1a",
    perClass: [
      { act: "WALKING",      f1: 90.8, precision: 91.2, recall: 90.4 },
      { act: "W_UPSTAIRS",   f1: 83.1, precision: 83.4, recall: 82.9 },
      { act: "W_DOWNSTAIRS", f1: 82.4, precision: 81.7, recall: 83.2 },
      { act: "SITTING",      f1: 86.3, precision: 86.9, recall: 85.7 },
      { act: "STANDING",     f1: 86.7, precision: 86.1, recall: 87.3 },
      { act: "LAYING",       f1: 99.0, precision: 99.1, recall: 99.0 },
    ],
    cm: [
      [451,22,18,0,5,0],[28,399,38,2,4,0],[22,31,364,3,0,0],
      [0,2,2,421,66,0],[3,0,1,58,470,0],[0,0,0,0,0,537],
    ],
  },
  "Logistic Reg.": {
    accuracy: 90.18, precision: 90.22, recall: 89.97, f1: 90.05,
    trainTime: 12.83, predTime: 1.2, color: "#7a6b1a",
    perClass: [
      { act: "WALKING",      f1: 93.1, precision: 93.4, recall: 92.8 },
      { act: "W_UPSTAIRS",   f1: 87.6, precision: 88.2, recall: 87.1 },
      { act: "W_DOWNSTAIRS", f1: 87.6, precision: 86.9, recall: 88.4 },
      { act: "SITTING",      f1: 88.9, precision: 89.3, recall: 88.6 },
      { act: "STANDING",     f1: 88.9, precision: 88.7, recall: 89.1 },
      { act: "LAYING",       f1: 99.9, precision: 99.9, recall: 99.9 },
    ],
    cm: [
      [463,15,13,1,4,0],[21,420,26,2,2,0],[14,24,379,3,0,0],
      [0,1,1,435,54,0],[2,0,0,48,482,0],[0,0,0,0,0,537],
    ],
  },
  "KNN": {
    accuracy: 91.04, precision: 91.11, recall: 90.88, f1: 90.97,
    trainTime: 0.08, predTime: 312.4, color: "#1e7a52",
    perClass: [
      { act: "WALKING",      f1: 93.9, precision: 94.1, recall: 93.7 },
      { act: "W_UPSTAIRS",   f1: 88.9, precision: 89.3, recall: 88.6 },
      { act: "W_DOWNSTAIRS", f1: 88.7, precision: 88.0, recall: 89.5 },
      { act: "SITTING",      f1: 90.1, precision: 90.4, recall: 89.8 },
      { act: "STANDING",     f1: 90.0, precision: 89.8, recall: 90.2 },
      { act: "LAYING",       f1: 99.9, precision: 99.9, recall: 99.9 },
    ],
    cm: [
      [468,14,11,1,2,0],[19,424,23,3,2,0],[13,22,381,4,0,0],
      [0,1,1,440,49,0],[1,0,0,44,487,0],[0,0,0,0,0,537],
    ],
  },
  "SVM": {
    accuracy: 94.87, precision: 94.79, recall: 94.68, f1: 94.72,
    trainTime: 38.72, predTime: 142.6, color: "#4a1e8a",
    perClass: [
      { act: "WALKING",      f1: 96.6, precision: 96.8, recall: 96.4 },
      { act: "W_UPSTAIRS",   f1: 93.1, precision: 93.4, recall: 92.8 },
      { act: "W_DOWNSTAIRS", f1: 92.9, precision: 92.1, recall: 93.7 },
      { act: "SITTING",      f1: 94.5, precision: 94.8, recall: 94.2 },
      { act: "STANDING",     f1: 94.6, precision: 94.3, recall: 94.9 },
      { act: "LAYING",       f1: 99.9, precision: 99.9, recall: 99.9 },
    ],
    cm: [
      [481,8,6,0,1,0],[11,442,16,1,1,0],[8,18,392,2,0,0],
      [0,0,0,462,29,0],[0,0,0,22,510,0],[0,0,0,0,0,537],
    ],
  },
};

const ALL_MODELS = Object.keys(MODEL_RESULTS);
const ACT_SHORT  = ["WALK", "W_UP", "W_DN", "SIT", "STAND", "LAY"];
const ACTIVITIES = ["WALKING","W_UPSTAIRS","W_DOWNSTAIRS","SITTING","STANDING","LAYING"];
const TABS = [
  { id: "overview",   label: "Overview",   icon: "◈" },
  { id: "comparison", label: "Comparison", icon: "⊞" },
  { id: "radar",      label: "Per-Class",  icon: "◎" },
  { id: "timing",     label: "Timing",     icon: "⏱" },
  { id: "matrix",     label: "Confusion",  icon: "⊟" },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", fontFamily: T.mono, fontSize: 11, boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}>
      {label && <div style={{ color: T.muted, marginBottom: 6, fontWeight: 600 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ color: T.text, fontWeight: 700 }}>{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, unit = "%", color = T.accent, sub }) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 20px", flex: 1, minWidth: 110, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: 9, color: T.muted, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: T.mono, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: T.mono, lineHeight: 1 }}>
        {typeof value === "number" ? value.toFixed(2) : value}
        <span style={{ fontSize: 12, color: T.muted }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: "-0.01em" }}>{title}</h2>
      {sub && <p style={{ fontSize: 12, color: T.muted, marginTop: 3, fontFamily: T.mono }}>{sub}</p>}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", ...style }}>
      {children}
    </div>
  );
}

function CardLabel({ children }) {
  return (
    <div style={{ fontSize: 10, color: T.muted, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: T.mono, marginBottom: 14, fontWeight: 600 }}>
      {children}
    </div>
  );
}

// ─── SECTION: OVERVIEW ────────────────────────────────────────────────────────
function SectionOverview({ model }) {
  const r = MODEL_RESULTS[model];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader title={`Overview — ${model}`} sub="Accuracy, per-class breakdown and real-time suitability" />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard label="Accuracy"  value={r.accuracy}  color={r.color} />
        <StatCard label="Precision" value={r.precision} color={r.color} />
        <StatCard label="Recall"    value={r.recall}    color={r.color} />
        <StatCard label="F1-Score"  value={r.f1}        color={r.color} />
        <StatCard label="Train Time" value={r.trainTime} unit="s" color={T.sub} sub="fitting time" />
        <StatCard label="Pred. Latency" value={r.predTime} unit="ms" color={r.predTime < 50 ? T.success : T.warn} sub="per window" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <CardLabel>Per-Class F1 Score</CardLabel>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={r.perClass} layout="vertical" margin={{ left: 0, right: 44, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
              <XAxis type="number" domain={[75, 100]} tick={{ fill: T.muted, fontSize: 10, fontFamily: T.mono }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="act" tick={{ fill: T.sub, fontSize: 10, fontFamily: T.mono }} width={92} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="f1" radius={[0, 5, 5, 0]} name="F1">
                {r.perClass.map((_, i) => <Cell key={i} fill={r.color} fillOpacity={0.55 + i * 0.08} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardLabel>Real-Time Performance</CardLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 8 }}>
            {[
              { label: "Training Time",      value: `${r.trainTime}s`,  pct: Math.min(r.trainTime / 40 * 100, 100),   good: r.trainTime < 5,   note: "offline — one-time cost" },
              { label: "Prediction Latency", value: `${r.predTime}ms`,  pct: Math.min(r.predTime / 350 * 100, 100),   good: r.predTime < 50,   note: "online — per sensor window" },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 12, color: T.sub, fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, marginLeft: 8 }}>{item.note}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: item.good ? T.success : T.warn, fontFamily: T.mono }}>{item.value}</span>
                </div>
                <div style={{ height: 10, background: T.bg, borderRadius: 5, overflow: "hidden", border: `1px solid ${T.border}` }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: item.good ? T.success : T.warn, borderRadius: 5, opacity: 0.75, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}

            <div style={{
              marginTop: 4, padding: "12px 16px", borderRadius: 10,
              background: r.predTime < 50 ? "#e8f5ed" : "#fdf0eb",
              border: `1px solid ${r.predTime < 50 ? "#a8d8be" : "#f0b89a"}`,
              fontSize: 12, color: r.predTime < 50 ? T.success : T.warn, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>{r.predTime < 50 ? "✓" : "⚠"}</span>
              {r.predTime < 50
                ? `Suitable for real-time at ${r.predTime}ms per window (50Hz sensor)`
                : `High latency — ${r.predTime}ms may lag at 50Hz sampling rate`}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── SECTION: COMPARISON ─────────────────────────────────────────────────────
function SectionComparison({ selected }) {
  const metrics = ["accuracy", "precision", "recall", "f1"];
  const barData = metrics.map(m => {
    const row = { metric: m.charAt(0).toUpperCase() + m.slice(1) };
    selected.forEach(name => { row[name] = MODEL_RESULTS[name][m]; });
    return row;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader title="Algorithm Comparison" sub="Side-by-side metrics across all selected models" />

      <Card>
        <CardLabel>Accuracy · Precision · Recall · F1-Score</CardLabel>
        <ResponsiveContainer width="100%" height={310}>
          <BarChart data={barData} margin={{ top: 4, right: 10, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="metric" tick={{ fill: T.sub, fontSize: 11, fontFamily: T.mono }} />
            <YAxis domain={[75, 100]} tick={{ fill: T.muted, fontSize: 10, fontFamily: T.mono }} tickFormatter={v => `${v}%`} />
            <Tooltip content={<ChartTip />} formatter={v => `${v.toFixed(2)}%`} />
            <Legend wrapperStyle={{ color: T.sub, fontSize: 11, fontFamily: T.mono }} />
            {selected.map(name => (
              <Bar key={name} dataKey={name} fill={MODEL_RESULTS[name].color} radius={[4, 4, 0, 0]} opacity={0.85} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <CardLabel>Full Metrics Summary</CardLabel>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: T.mono }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                {["Algorithm", "Accuracy", "Precision", "Recall", "F1-Score", "Train Time", "Pred Time"].map(h => (
                  <th key={h} style={{ padding: "9px 14px", textAlign: "left", color: T.muted, fontSize: 10, letterSpacing: "0.1em", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selected.map((name, idx) => {
                const r    = MODEL_RESULTS[name];
                const best = name === "Random Forest";
                return (
                  <tr key={name} style={{ borderBottom: `1px solid ${T.border}`, background: best ? T.accentBg : idx % 2 === 0 ? T.bg : T.panel }}>
                    <td style={{ padding: "11px 14px", color: r.color, fontWeight: 800 }}>{best ? "★ " : ""}{name}</td>
                    {[r.accuracy, r.precision, r.recall, r.f1].map((v, i) => (
                      <td key={i} style={{ padding: "11px 14px", color: T.text, fontWeight: best ? 700 : 400 }}>{v.toFixed(2)}%</td>
                    ))}
                    <td style={{ padding: "11px 14px", color: T.muted }}>{r.trainTime}s</td>
                    <td style={{ padding: "11px 14px", color: r.predTime < 50 ? T.success : T.warn, fontWeight: 700 }}>{r.predTime}ms</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── SECTION: RADAR ───────────────────────────────────────────────────────────
function SectionRadar({ selected }) {
  const radarData = ACTIVITIES.map((act, i) => {
    const row = { act: ACT_SHORT[i] };
    selected.forEach(name => { row[name] = MODEL_RESULTS[name].perClass[i].f1; });
    return row;
  });
  const barData = ACTIVITIES.map((act, i) => {
    const row = { act: ACT_SHORT[i] };
    selected.forEach(name => { row[name] = MODEL_RESULTS[name].perClass[i].f1; });
    return row;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader title="Per-Class Performance" sub="F1-score breakdown by activity for selected models" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <CardLabel>Radar — F1 by Activity</CardLabel>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} margin={{ top: 10, right: 24, bottom: 10, left: 24 }}>
              <PolarGrid stroke={T.border} />
              <PolarAngleAxis dataKey="act" tick={{ fill: T.sub, fontSize: 10, fontFamily: T.mono }} />
              <PolarRadiusAxis domain={[75, 100]} tick={{ fill: T.muted, fontSize: 8 }} tickCount={4} />
              <Tooltip content={<ChartTip />} />
              {selected.map(name => (
                <Radar key={name} name={name} dataKey={name}
                  stroke={MODEL_RESULTS[name].color} fill={MODEL_RESULTS[name].color}
                  fillOpacity={0.12} strokeWidth={2}
                />
              ))}
              <Legend wrapperStyle={{ color: T.sub, fontSize: 10, fontFamily: T.mono }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardLabel>F1 Grouped by Activity</CardLabel>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ left: 0, right: 10, top: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="act" tick={{ fill: T.sub, fontSize: 9, fontFamily: T.mono }} />
              <YAxis domain={[75, 100]} tick={{ fill: T.muted, fontSize: 9, fontFamily: T.mono }} />
              <Tooltip content={<ChartTip />} />
              <Legend wrapperStyle={{ color: T.sub, fontSize: 10, fontFamily: T.mono }} />
              {selected.map(name => (
                <Bar key={name} dataKey={name} fill={MODEL_RESULTS[name].color} radius={[3, 3, 0, 0]} opacity={0.85} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ─── SECTION: TIMING ─────────────────────────────────────────────────────────
function SectionTiming({ selected }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader title="Timing Analysis" sub="Training cost vs prediction latency — critical for real-time deployment" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { key: "trainTime", label: "Training Time (seconds)", max: 40, unit: "s",  note: "One-time offline cost", threshold: 5 },
          { key: "predTime",  label: "Prediction Latency (ms)", max: 350, unit: "ms", note: "Per-window online cost", threshold: 50 },
        ].map(item => (
          <Card key={item.key}>
            <CardLabel>{item.label}</CardLabel>
            <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, marginBottom: 18 }}>{item.note} · threshold: {item.threshold}{item.unit}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {selected.map(name => {
                const val  = MODEL_RESULTS[name][item.key];
                const pct  = Math.min(val / item.max * 100, 100);
                const good = val < item.threshold;
                const c    = MODEL_RESULTS[name].color;
                return (
                  <div key={name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: c, fontWeight: 700 }}>{name}</span>
                      <span style={{ fontSize: 12, fontFamily: T.mono, fontWeight: 700, color: good ? T.success : T.warn }}>
                        {val}{item.unit}
                      </span>
                    </div>
                    <div style={{ height: 10, background: T.bg, borderRadius: 5, overflow: "hidden", border: `1px solid ${T.border}` }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${c}bb, ${c})`, borderRadius: 5, transition: "width 0.9s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardLabel>Accuracy vs Prediction Latency</CardLabel>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={selected.map(name => ({
              name, accuracy: MODEL_RESULTS[name].accuracy,
              predTime: MODEL_RESULTS[name].predTime,
              color: MODEL_RESULTS[name].color,
            }))}
            margin={{ top: 4, right: 20, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="name" tick={{ fill: T.sub, fontSize: 10, fontFamily: T.mono }} />
            <YAxis yAxisId="acc" domain={[75, 100]} tick={{ fill: T.muted, fontSize: 9, fontFamily: T.mono }} tickFormatter={v => `${v}%`} />
            <YAxis yAxisId="lat" orientation="right" tick={{ fill: T.muted, fontSize: 9, fontFamily: T.mono }} tickFormatter={v => `${v}ms`} />
            <Tooltip content={<ChartTip />} />
            <Legend wrapperStyle={{ color: T.sub, fontSize: 10, fontFamily: T.mono }} />
            <Bar yAxisId="acc" dataKey="accuracy" name="Accuracy %" radius={[4,4,0,0]} opacity={0.85}>
              {selected.map(name => <Cell key={name} fill={MODEL_RESULTS[name].color} />)}
            </Bar>
            <Bar yAxisId="lat" dataKey="predTime" name="Latency (ms)" fill={T.borderMd} radius={[4,4,0,0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ─── SECTION: CONFUSION MATRIX ────────────────────────────────────────────────
function SectionMatrix({ selected, focusModel, setFocusModel }) {
  const r = MODEL_RESULTS[focusModel];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader title="Confusion Matrix" sub="Actual vs predicted labels — diagonal = correct classifications" />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {selected.map(name => (
          <button key={name} onClick={() => setFocusModel(name)} style={{
            padding: "7px 18px", borderRadius: 7,
            border: `1.5px solid ${focusModel === name ? MODEL_RESULTS[name].color : T.border}`,
            background: focusModel === name ? `${MODEL_RESULTS[name].color}18` : T.panel,
            color: focusModel === name ? MODEL_RESULTS[name].color : T.sub,
            fontSize: 12, fontFamily: T.mono, cursor: "pointer",
            fontWeight: focusModel === name ? 700 : 400, transition: "all 0.15s",
            boxShadow: focusModel === name ? `0 2px 8px ${MODEL_RESULTS[name].color}30` : "none",
          }}>{name}</button>
        ))}
      </div>

      <Card>
        <CardLabel>Matrix — <span style={{ color: r.color }}>{focusModel}</span></CardLabel>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", overflowX: "auto" }}>
          {/* Grid */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "80px repeat(6, 62px)", gap: 3, marginBottom: 4 }}>
              <div />
              {ACT_SHORT.map(l => (
                <div key={l} style={{ fontSize: 9, color: T.muted, textAlign: "center", fontFamily: T.mono, fontWeight: 600, padding: "2px 0" }}>{l}</div>
              ))}
            </div>
            {r.cm.map((row, ri) => {
              const rowMax = Math.max(...row);
              return (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: "80px repeat(6, 62px)", gap: 3, marginBottom: 3 }}>
                  <div style={{ fontSize: 9, color: T.muted, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10, fontFamily: T.mono, fontWeight: 600 }}>
                    {ACT_SHORT[ri]}
                  </div>
                  {row.map((val, ci) => {
                    const intensity = rowMax > 0 ? val / rowMax : 0;
                    const isDiag = ri === ci;
                    const bg = isDiag
                      ? `rgba(196,122,30,${0.1 + intensity * 0.75})`
                      : `rgba(176,58,26,${intensity * 0.55})`;
                    const fg = intensity > 0.45 ? (isDiag ? "#5a2e00" : "#6b1500") : T.muted;
                    return (
                      <div key={ci} style={{
                        height: 48, background: bg, color: fg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: isDiag ? 800 : 400, fontFamily: T.mono,
                        borderRadius: 6,
                        border: isDiag ? `1.5px solid ${r.color}60` : `1px solid ${T.border}55`,
                        transition: "background 0.2s",
                      }}>{val}</div>
                    );
                  })}
                </div>
              );
            })}
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 9, color: T.muted, fontFamily: T.mono, letterSpacing: "0.12em", paddingLeft: 83 }}>
              PREDICTED →
            </div>
          </div>

          {/* Sidebar per-class recall */}
          <div style={{ minWidth: 210, flex: 1 }}>
            <div style={{ fontSize: 10, color: T.muted, fontFamily: T.mono, letterSpacing: "0.1em", fontWeight: 600, marginBottom: 14 }}>RECALL PER CLASS</div>
            {r.cm.map((row, i) => {
              const total = row.reduce((a, b) => a + b, 0);
              const pct   = total > 0 ? (row[i] / total * 100) : 0;
              const col   = pct > 95 ? T.success : pct > 88 ? T.accent : T.warn;
              return (
                <div key={i} style={{ marginBottom: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: T.sub, fontFamily: T.mono, fontWeight: 600 }}>{ACT_SHORT[i]}</span>
                    <span style={{ fontSize: 12, fontFamily: T.mono, fontWeight: 800, color: col }}>{pct.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 7, background: T.bg, borderRadius: 4, overflow: "hidden", border: `1px solid ${T.border}` }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 4, opacity: 0.8, transition: "width 1s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selected,   setSelected]   = useState(["Random Forest", "SVM", "Decision Tree"]);
  const [focusModel, setFocusModel] = useState("Random Forest");
  const [activeTab,  setActiveTab]  = useState("overview");
  const [animKey,    setAnimKey]    = useState(0);

  const toggle = (m) =>
    setSelected(prev =>
      prev.includes(m)
        ? prev.length > 1 ? prev.filter(x => x !== m) : prev
        : [...prev, m]
    );

  const goTab = (t) => { setActiveTab(t); setAnimKey(k => k + 1); };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: T.bg, color: T.text, fontFamily: T.sans, overflow: "hidden" }}>
      <style>{`
        @keyframes fadeSlide { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade { animation: fadeSlide 0.28s ease both; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .pulse { animation: pulse 2.5s ease infinite; }
        button { font-family: inherit; }
        .nav-btn:hover { background: ${T.accentBg} !important; color: ${T.accent} !important; }
        .chip:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); transform: translateY(-1px); }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── HEADER ────────────────────────────────────────────── */}
      <header style={{
        flexShrink: 0, height: 58, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 28px",
        background: T.panel, borderBottom: `1px solid ${T.border}`,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div className="pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, boxShadow: `0 0 6px ${T.accent}88` }} />
            <span style={{ fontSize: 10, color: T.accent, fontFamily: T.mono, letterSpacing: "0.18em", fontWeight: 700 }}>HAR · ML DASHBOARD</span>
          </div>
          <div style={{ width: 1, height: 22, background: T.border }} />
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", color: T.text }}>
            Human Activity Recognition
          </span>
          <span style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>
            UCI HAR · Accelerometer · 6 Activities · 10,299 samples
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {[
            { l: "Best Accuracy", v: "96.42%", c: T.accent },
            { l: "Best F1",       v: "96.31%", c: T.accent },
            { l: "Top Model",     v: "Random Forest", c: T.sub },
          ].map(item => (
            <div key={item.l} style={{ textAlign: "right" }}>
              <div style={{ fontSize: 9, color: T.muted, fontFamily: T.mono, letterSpacing: "0.1em" }}>{item.l}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: item.c, fontFamily: T.mono }}>{item.v}</div>
            </div>
          ))}
        </div>
      </header>

      {/* ── BODY ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <aside style={{
          flexShrink: 0, width: 228, background: T.panel,
          borderRight: `1px solid ${T.border}`,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>

          {/* Algorithm toggles */}
          <div style={{ padding: "16px 14px 14px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 9, color: T.muted, fontFamily: T.mono, letterSpacing: "0.14em", fontWeight: 600, marginBottom: 10 }}>SELECT ALGORITHMS</div>
            {ALL_MODELS.map(m => {
              const sel = selected.includes(m);
              const c   = MODEL_RESULTS[m].color;
              return (
                <button key={m} className="chip" onClick={() => toggle(m)} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "7px 10px", borderRadius: 7, width: "100%", marginBottom: 3,
                  border: `1px solid ${sel ? c + "55" : T.border}`,
                  background: sel ? `${c}0f` : "transparent",
                  color: sel ? c : T.sub,
                  fontSize: 12, fontWeight: sel ? 700 : 400, cursor: "pointer",
                  textAlign: "left", transition: "all 0.15s",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: sel ? c : T.border, boxShadow: sel ? `0 0 5px ${c}99` : "none", flexShrink: 0, transition: "all 0.15s" }} />
                  {m}
                </button>
              );
            })}
          </div>

          {/* Focus model */}
          <div style={{ padding: "14px 14px 12px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 9, color: T.muted, fontFamily: T.mono, letterSpacing: "0.14em", fontWeight: 600, marginBottom: 10 }}>FOCUS MODEL</div>
            {selected.map(m => {
              const isFocus = focusModel === m;
              const r = MODEL_RESULTS[m];
              return (
                <button key={m} onClick={() => setFocusModel(m)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 10px", borderRadius: 7, width: "100%", marginBottom: 3,
                  border: `1px solid ${isFocus ? r.color + "55" : T.border}`,
                  background: isFocus ? `${r.color}12` : "transparent",
                  color: isFocus ? r.color : T.sub,
                  fontSize: 11, cursor: "pointer", textAlign: "left",
                  fontWeight: isFocus ? 700 : 400, transition: "all 0.15s",
                  boxShadow: isFocus ? `0 1px 6px ${r.color}22` : "none",
                }}>
                  <span>{m}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 800 }}>{r.accuracy.toFixed(1)}%</span>
                </button>
              );
            })}
          </div>

          {/* Nav */}
          <div style={{ padding: "14px 14px", flex: 1 }}>
            <div style={{ fontSize: 9, color: T.muted, fontFamily: T.mono, letterSpacing: "0.14em", fontWeight: 600, marginBottom: 10 }}>VIEWS</div>
            {TABS.map(t => {
              const active = activeTab === t.id;
              return (
                <button key={t.id} className="nav-btn" onClick={() => goTab(t.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
                  borderRadius: 7, width: "100%", marginBottom: 2, border: "none",
                  background: active ? T.accentBg : "transparent",
                  color: active ? T.accent : T.sub,
                  fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer",
                  textAlign: "left", borderLeft: active ? `3px solid ${T.accent}` : "3px solid transparent",
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Best model badge */}
          <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ background: T.accentBg, border: `1px solid ${T.accentDim}`, borderRadius: 9, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, color: T.muted, fontFamily: T.mono, letterSpacing: "0.1em", fontWeight: 600 }}>★ TOP PERFORMER</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.accent, marginTop: 2 }}>Random Forest</div>
              <div style={{ fontSize: 10, color: T.sub, fontFamily: T.mono, marginTop: 2 }}>96.42% acc · 18.3ms latency</div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ────────────────────────────────────── */}
        <main style={{ flex: 1, overflow: "auto", padding: "28px 32px", background: T.bg }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
            <span style={{ fontSize: 11, color: T.muted, fontFamily: T.mono }}>Dashboard</span>
            <span style={{ fontSize: 11, color: T.borderMd }}>›</span>
            <span style={{ fontSize: 11, color: T.accent, fontFamily: T.mono, fontWeight: 700 }}>
              {TABS.find(t => t.id === activeTab)?.label}
            </span>
            {(activeTab === "overview" || activeTab === "matrix") && (
              <>
                <span style={{ fontSize: 11, color: T.borderMd }}>›</span>
                <span style={{ fontSize: 11, color: MODEL_RESULTS[focusModel].color, fontFamily: T.mono, fontWeight: 700 }}>{focusModel}</span>
              </>
            )}
          </div>

          <div key={animKey} className="fade">
            {activeTab === "overview"   && <SectionOverview   model={focusModel} />}
            {activeTab === "comparison" && <SectionComparison selected={selected} />}
            {activeTab === "radar"      && <SectionRadar      selected={selected} />}
            {activeTab === "timing"     && <SectionTiming     selected={selected} />}
            {activeTab === "matrix"     && <SectionMatrix     selected={selected} focusModel={focusModel} setFocusModel={setFocusModel} />}
          </div>
        </main>
      </div>
    </div>
  );
}
