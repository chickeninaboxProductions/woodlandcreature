import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "./Root.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

function ReputationTrack({
  value,
  rows,
  color,
  direction = "ltr"
}) {
  let remaining = value;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {rows.map((rowSize, rowIndex) => {
        const filled = Math.min(remaining, rowSize);
        remaining -= filled;

        return (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              gap: 2,
              flexDirection:
                direction === "rtl" ? "row-reverse" : "row"
            }}
          >
            {Array.from({ length: rowSize }).map((_, i) => {
              const isFilled =
                direction === "rtl"
                  ? i >= rowSize - filled
                  : i < filled;

              return (
                <div
                  key={i}
                  style={{
                    width: 14,
                    height: 14,
                    border: "1px solid #000",
                    background: isFilled ? color : "#fff"
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function RepPage() {
  const { id: characterId } = useParams();

  const [factions, setFactions] = useState([]);
  const [prestige, setPrestige] = useState([]);
  const [notoriety, setNotoriety] = useState([]);

  useEffect(() => {
    loadData();
  }, [characterId]);
async function changeTrack(type, factionId, delta) {
  const list = type === "prestige" ? prestige : notoriety;
  const setter = type === "prestige" ? setPrestige : setNotoriety;

  const row = list.find(r => r.Faction === factionId);

  if (!row) return;

  const max = type === "prestige" ? 30 : 18;
  const newLevel = Math.max(0, Math.min(max, row.Level + delta));

  const { error } = await supabase
    .from(type === "prestige" ? "Prestige" : "Notoriety")
    .update({ Level: newLevel })
    .eq("id", row.id);

  if (error) {
    console.error(error);
    return;
  }

  setter(list.map(r =>
    r.id === row.id
      ? { ...r, Level: newLevel }
      : r
  ));
}
  async function loadData() {
    const [
      { data: factionsData },
      { data: prestigeData },
      { data: notorietyData }
    ] = await Promise.all([
      supabase.from("Faction").select("*"),
      supabase.from("Prestige").select("*").eq("Character", characterId),
      supabase.from("Notoriety").select("*").eq("Character", characterId)
    ]);

    setFactions(factionsData || []);
    setPrestige(prestigeData || []);
    setNotoriety(notorietyData || []);
  }

  function getPrestige(factionId) {
    return prestige.find(p => p.Faction === factionId)?.Level ?? 0;
  }

  function getNotoriety(factionId) {
    return notoriety.find(n => n.Faction === factionId)?.Level ?? 0;
  }

  function getReputation(prestigeVal, notorietyVal) {
  const prestigeTiers = [5, 15, 30];
  const notorietyTiers = [3, 9, 18];

  const prestigeScore =
    prestigeTiers.filter(t => prestigeVal >= t).length;

  const notorietyScore =
    notorietyTiers.filter(t => notorietyVal >= t).length;

  return prestigeScore - notorietyScore;
}

  return (
    <div className="character-sheet" style={{ padding: "24px" }}>
      <Link
        to={`/character/${characterId}`}
        style={{
          display: "inline-block",
          marginBottom: "10px",
          color: "#000",
          textDecoration: "none",
          border: "1px solid #000",
          padding: "4px 8px",
          background: "#fff"
        }}
      >
        ← Back
      </Link>

      <div
        style={{
          border: "1px solid #000",
          borderRadius: "4px",
          padding: "18px",
          background: "#fff",
          color: "#000"
        }}
      >

        <div style={{ display: "grid", gap: 16 }}>

  {/* HEADER */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "140px 1fr 80px 1fr",
      gap: 12,
      fontWeight: "bold",
      textAlign: "center",
      padding: "0 12px"
    }}
  >
    <div style={{ textAlign: "left" }}>Faction</div>
    <div>Notoriety</div>
    <div></div>
    <div>Prestige</div>
  </div>

  {factions
    .sort((a, b) => a.id - b.id)
    .map(faction => {
      const p = getPrestige(faction.id);
      const n = getNotoriety(faction.id);
      const rep = getReputation(p, n);

      return (
        <div
          key={faction.id}
          className="panel"
          style={{
            padding: 12,
            display: "grid",
            gridTemplateColumns: "140px 1fr 80px 1fr",
            alignItems: "center",
            gap: 12
          }}
        >
          {/* FACTION */}
          <div style={{ fontWeight: "bold" }}>
            {faction.Name}
          </div>

          {/* NOTORIETY */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
          >
            <button onClick={() => changeTrack("notoriety", faction.id, -1)}>
              -
            </button>

            <ReputationTrack
              value={n}
              rows={[3, 6, 9]}
              color="#d33"
              direction="rtl"
            />

            <button onClick={() => changeTrack("notoriety", faction.id, 1)}>
              +
            </button>
          </div>

          {/* REPUTATION */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: 24
            }}
          >
            {rep >= 0 ? `+${rep}` : rep}
          </div>

          {/* PRESTIGE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
          >
            <button onClick={() => changeTrack("prestige", faction.id, -1)}>
              -
            </button>

            <ReputationTrack
              value={p}
              rows={[5, 10, 15]}
              color="#3a3"
              direction="ltr"
            />

            <button onClick={() => changeTrack("prestige", faction.id, 1)}>
              +
            </button>
          </div>
        </div>
      );
    })}
</div>
      </div>
    </div>
  );
}