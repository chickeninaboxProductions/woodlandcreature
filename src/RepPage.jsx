import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "./Root.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function RepPage() {
  const { id: characterId } = useParams();

  const [factions, setFactions] = useState([]);
  const [prestige, setPrestige] = useState([]);
  const [notoriety, setNotoriety] = useState([]);

  useEffect(() => {
    loadData();
  }, [characterId]);

  async function loadData() {
    const [
      { data: factionsData },
      { data: prestigeData },
      { data: notorietyData }
    ] = await Promise.all([
      supabase.from("Faction").select("*"),

      supabase
        .from("Prestige")
        .select("*")
        .eq("Character", characterId),

      supabase
        .from("Notoriety")
        .select("*")
        .eq("Character", characterId),
    ]);

    setFactions(factionsData || []);
    setPrestige(prestigeData || []);
    setNotoriety(notorietyData || []);
  }

  function renderRepList(title, dataList, setDataList, maxValue) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h2 className="panel-title" style={{ marginBottom: "10px" }}>
        {title}
      </h2>

      <div style={{ display: "grid", gap: "8px" }}>
        {[...factions]
          .sort((a, b) => a.id - b.id)
          .map((faction) => {
            const match = dataList.find(
              (p) => p.Faction === faction.id
            );

            const value = match ? match.Level : 0;

            function updateValue(newValue) {
              setDataList((prev) => {
                const existing = prev.find(
                  (p) => p.Faction === faction.id
                );

                if (existing) {
                  return prev.map((p) =>
                    p.Faction === faction.id
                      ? { ...p, Level: newValue }
                      : p
                  );
                }

                return [
                  ...prev,
                  {
                    Faction: faction.id,
                    Level: newValue,
                    Character: characterId,
                  },
                ];
              });
            }

            return (
              <div
  className="panel"
  key={faction.id}
  style={{
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }}
>
  <strong style={{ width: "45%", flexShrink: 0 }}>
    {faction.Name}
  </strong>

  <input
    type="range"
    min="0"
    max={maxValue}
    value={value}
    onChange={(e) => updateValue(Number(e.target.value))}
    style={{
      width: "100%",   // <-- key change
    }}
  />

  <span style={{ width: "30px", textAlign: "right", flexShrink: 0 }}>
    {value}
  </span>
</div>
            );
          })}
      </div>
    </div>
  );
}

  return (
    <div className="character-sheet"
      style={{
        padding: "24px",
      }}
    >
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
        <h1 className="sheet-title"
          style={{
            marginTop: 0,
            marginBottom: "24px",

          }}
        >
          Reputation
        </h1>

        {renderRepList("Prestige", prestige, setPrestige, 30)}

        {renderRepList("Notoriety", notoriety, setNotoriety, 18)}
      </div>
    </div>
  );
}