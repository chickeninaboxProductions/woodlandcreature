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

  function renderReputation(title, prestigeList, notorietyList) {
  const PRESTIGE_MAX = 15;
  const NOTORIETY_MAX = 9;

  function getPrestige(factionId) {
    return prestigeList.find(p => p.Faction === factionId)?.Level ?? 0;
  }

  function getNotoriety(factionId) {
    return notorietyList.find(n => n.Faction === factionId)?.Level ?? 0;
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <h2 className="panel-title">{title}</h2>

      <div style={{ display: "grid", gap: 10 }}>
        {factions
          .sort((a, b) => a.id - b.id)
          .map(faction => {
            const prestige = getPrestige(faction.id);
            const notoriety = getNotoriety(faction.id);

            return (
              <div
                key={faction.id}
                className="panel"
                style={{
                  padding: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}
              >
                {/* NAME */}
                <strong style={{ width: 140 }}>
                  {faction.Name}
                </strong>

                {/* NOTORIETY (RIGHT → LEFT) */}
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: NOTORIETY_MAX }).map((_, i) => {
                    const indexFromRight = NOTORIETY_MAX - 1 - i;

                    return (
                      <div
                        key={i}
                        style={{
                          width: 14,
                          height: 14,
                          border: "1px solid #000",
                          background:
                            notoriety > indexFromRight ? "#d33" : "#fff"
                        }}
                      />
                    );
                  })}
                </div>

                {/* CENTER LABEL */}
                <div style={{ width: 90, textAlign: "center" }}>
                </div>

                {/* PRESTIGE (LEFT → RIGHT, 5|5|5 visual grouping optional) */}
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: PRESTIGE_MAX }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 14,
                        height: 14,
                        border: "1px solid #000",
                        background: i < prestige ? "#3a3" : "#fff"
                      }}
                    />
                  ))}
                </div>
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

        {renderReputation("", prestige, notoriety)}
      </div>
    </div>
  );
}