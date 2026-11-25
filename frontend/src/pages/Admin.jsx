import React, { useState, useEffect } from "react";
import { Check, X, Clock, RefreshCw, Eye, Download } from "lucide-react";

const PRODUCT_LABEL = { bouquet: "Scented bouquet", scent: "Perfume scent" };
const parsePicks = (r) => { try { return JSON.parse(r.color_selections || "[]"); } catch { return []; } };
const picksText = (r) => parsePicks(r).map((p) => `${PRODUCT_LABEL[p.product] || p.product}: ${p.name} x${p.qty}`).join(" | ");

const API = import.meta.env.VITE_API_URL || "/api";

const STATUS_STYLES = {
  pending:   { bg: "#F6D5B230", color: "#8F2F52", label: "Pending",   icon: Clock },
  confirmed: { bg: "#C3C7B930", color: "#5E6E54", label: "Confirmed", icon: Check },
  declined:  { bg: "#DBA1A330", color: "#8F2F52", label: "Declined",  icon: X },
};

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchRSVPs = async (pw = password) => {
    const safePassword = String(pw || "").trim();
    if (!safePassword) {
      setError("Please enter the admin password.");
      setAuthed(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/rsvp?password=${encodeURIComponent(safePassword)}`);
      if (res.status === 401) { setError("Wrong password."); setAuthed(false); return; }
      const data = await res.json();
      setRsvps(data);
      setAuthed(true);
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const safePassword = String(password || "").trim();
    await fetch(`${API}/rsvp/${id}/status?password=${encodeURIComponent(safePassword)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRsvps((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const exportCSV = () => {
    const headers = ["ID","Name","Email","Phone","Guests","Activities","Colours","Seats","Payment","Status","Date"];
    const rows = rsvps.map((r) => [
      r.id, r.full_name, r.email, r.phone || "", r.guest_names || "",
      r.selected_package, picksText(r), r.number_of_seats, r.payment_method, r.status, r.created_at
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "rsvps.csv"; a.click();
  };

  const filtered = filter === "all" ? rsvps : rsvps.filter((r) => r.status === filter);
  const counts = { all: rsvps.length, pending: rsvps.filter(r=>r.status==="pending").length, confirmed: rsvps.filter(r=>r.status==="confirmed").length, declined: rsvps.filter(r=>r.status==="declined").length };
  // Prep list — what to prepare, from every RSVP that isn't declined
  const prep = { bouquet: {}, scent: {} };
  rsvps.filter((r) => r.status !== "declined").forEach((r) =>
    parsePicks(r).forEach((p) => {
      if (!prep[p.product]) return;
      prep[p.product][p.name] = (prep[p.product][p.name] || 0) + p.qty;
    })
  );
  const totalSeats = rsvps.filter(r=>r.status!=="declined").reduce((s,r)=>s+r.number_of_seats,0);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6" style={{ backgroundColor: "#402B24" }}>
        <div className="w-full max-w-sm text-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.45em]" style={{ color: "#DBA1A3" }}>Admin</p>
          <h1 className="font-display mb-8 text-4xl" style={{ color: "#F8F3ED", fontStyle: "italic" }}>Lily Workshop RSVPs</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRSVPs()}
            className="w-full rounded-xl px-4 py-3 text-sm mb-3"
            style={{ backgroundColor: "rgba(248,243,237,0.08)", border: "1px solid rgba(248,243,237,0.15)", color: "#F8F3ED", outline: "none" }}
            autoFocus
          />
          {error && <p className="mb-3 text-sm" style={{ color: "#DBA1A3" }}>{error}</p>}
          <button
            onClick={() => fetchRSVPs()}
            disabled={loading}
            className="w-full rounded-xl py-3 text-sm font-semibold uppercase tracking-wider transition-colors"
            style={{ backgroundColor: "#A93A60", color: "#F8F3ED" }}
          >
            {loading ? "Loading..." : "Enter"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F3ED" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#402B24" }} className="px-6 py-6 md:px-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em]" style={{ color: "#DBA1A3" }}>Admin Dashboard</p>
            <h1 className="font-display text-3xl" style={{ color: "#F8F3ED", fontStyle: "italic" }}>Lily Workshop RSVPs</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider" style={{ backgroundColor: "rgba(248,243,237,0.1)", color: "#F8F3ED", border: "1px solid rgba(248,243,237,0.15)" }}>
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            <button onClick={() => fetchRSVPs()} disabled={loading} className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium uppercase tracking-wider" style={{ backgroundColor: "#A93A60", color: "#F8F3ED" }}>
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total RSVPs", value: counts.all, color: "#A93A60" },
            { label: "Confirmed", value: counts.confirmed, color: "#5E6E54" },
            { label: "Pending", value: counts.pending, color: "#8E9A82" },
            { label: "Total Seats", value: totalSeats, color: "#DBA1A3" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-5 pastel-card">
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "rgba(64,43,36,0.5)" }}>{s.label}</p>
              <p className="font-display text-4xl" style={{ color: s.color, fontStyle: "italic" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Prep list */}
        <div className="mb-8 rounded-2xl p-5 pastel-card">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(64,43,36,0.5)" }}>
            Prep list — colours to prepare (pending + confirmed)
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {Object.keys(prep).map((product) => {
              const entries = Object.entries(prep[product]).sort((a, b) => b[1] - a[1]);
              const total = entries.reduce((n, [, q]) => n + q, 0);
              return (
                <div key={product}>
                  <p className="font-display mb-2 text-2xl" style={{ color: "#402B24" }}>
                    {PRODUCT_LABEL[product]}s <span className="text-base" style={{ color: "rgba(64,43,36,0.5)" }}>· {total} total</span>
                  </p>
                  {entries.length === 0 ? (
                    <p className="text-xs" style={{ color: "rgba(64,43,36,0.4)" }}>No picks yet.</p>
                  ) : (
                    <ul className="space-y-1 text-sm" style={{ color: "rgba(64,43,36,0.8)" }}>
                      {entries.map(([name, q]) => (
                        <li key={name} className="flex justify-between border-b border-dashed py-1" style={{ borderColor: "rgba(64,43,36,0.12)" }}>
                          <span>{name}</span><strong>× {q}</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {["all","pending","confirmed","declined"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors"
              style={filter === f
                ? { backgroundColor: "#402B24", color: "#F8F3ED" }
                : { backgroundColor: "#EBCFCB", color: "rgba(64,43,36,0.65)" }
              }
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl pastel-card">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #EBCFCB", backgroundColor: "#F8F3ED" }}>
                {["#","Guests","Colours","Seats","Contact","Payment","Status","Date","Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "rgba(64,43,36,0.45)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="py-16 text-center text-sm" style={{ color: "rgba(64,43,36,0.4)" }}>No RSVPs yet.</td></tr>
              ) : filtered.map((r, i) => {
                const st = STATUS_STYLES[r.status] || STATUS_STYLES.pending;
                const Icon = st.icon;
                return (
                  <tr key={r.id} style={{ borderBottom: "1px solid #EBCFCB", backgroundColor: i % 2 === 0 ? "white" : "#F8F3ED" }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "rgba(64,43,36,0.4)" }}>#{r.id}</td>
                    <td className="px-4 py-3" style={{ minWidth: "160px" }}>
                      <p className="font-medium" style={{ color: "#402B24" }}>{r.full_name}</p>
                      {r.guest_names && r.guest_names !== r.full_name && (
                        <p className="text-xs mt-0.5" style={{ color: "rgba(64,43,36,0.5)" }}>{r.guest_names}</p>
                      )}
                    </td>
                    <td className="px-4 py-3" style={{ minWidth: "180px" }}>
                      {parsePicks(r).length === 0 ? (
                        <p className="text-xs" style={{ color: "rgba(64,43,36,0.4)" }}>—</p>
                      ) : (
                        <ul className="space-y-0.5 text-xs leading-relaxed" style={{ color: "rgba(64,43,36,0.75)" }}>
                          {parsePicks(r).map((p) => (
                            <li key={p.product + p.variant_id}>
                              <span style={{ color: "rgba(64,43,36,0.45)" }}>{p.product === "bouquet" ? "Bouquet" : "Scent"}:</span> {p.name} × {p.qty}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-medium" style={{ color: "#402B24" }}>{r.number_of_seats}</td>
                    <td className="px-4 py-3" style={{ minWidth: "160px" }}>
                      <p className="text-xs" style={{ color: "rgba(64,43,36,0.7)" }}>{r.email}</p>
                      {r.phone && <p className="text-xs" style={{ color: "rgba(64,43,36,0.5)" }}>{r.phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {r.payment_screenshot_url ? (
                        <button onClick={() => setPreview(r.payment_screenshot_url)} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#A93A60" }}>
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                      ) : r.payment_link ? (
                        <span className="text-xs" style={{ color: "rgba(64,43,36,0.6)" }} title={r.payment_link}>Link ✓</span>
                      ) : (
                        <span className="text-xs" style={{ color: "rgba(64,43,36,0.3)" }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: st.bg, color: st.color }}>
                        <Icon className="h-3 w-3" /> {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(64,43,36,0.45)" }}>
                      {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => updateStatus(r.id, "confirmed")} title="Confirm"
                          className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
                          style={{ backgroundColor: r.status === "confirmed" ? "#5E6E54" : "#C3C7B930", color: r.status === "confirmed" ? "white" : "#5E6E54" }}>
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => updateStatus(r.id, "declined")} title="Decline"
                          className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
                          style={{ backgroundColor: r.status === "declined" ? "#8F2F52" : "#DBA1A330", color: r.status === "declined" ? "white" : "#8F2F52" }}>
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: "rgba(64,43,36,0.85)" }} onClick={() => setPreview(null)}>
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute -top-4 -right-4 flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: "#A93A60", color: "white" }}>
              <X className="h-4 w-4" />
            </button>
            <img src={preview} alt="Payment screenshot" className="w-full rounded-2xl object-contain" style={{ maxHeight: "80vh" }} />
          </div>
        </div>
      )}
    </div>
  );
}
