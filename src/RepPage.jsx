import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

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

  function renderRepList(title, dataList) {
    return (
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            marginBottom: "10px",
            color: "#000"
          }}
        >
          {title}
        </h2>

        <div
          style={{
            display: "grid",
            gap: "8px"
          }}
        >
          {factions.map((faction) => {
            const match = dataList.find(
              (p) => p.Faction === faction.id
            );

            return (
              <div
                key={faction.id}
                style={{
                  border: "1px solid #000",
                  borderRadius: "4px",
                  padding: "10px",
                  background: "#fff",
                  color: "#000",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <strong style={{ color: "#000" }}>
                  {faction.Name}
                </strong>

                <span style={{ color: "#000" }}>
                  {match ? match.Level : 0}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "Arial",
        color: "#000"
      }}
    >
      <Link
        to={`/character/${characterId}`}
        style={{
          display: "inline-block",
          marginBottom: "20px",
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
        <h1
          style={{
            marginTop: 0,
            marginBottom: "24px",
            color: "#000"
          }}
        >
          Reputation
        </h1>

        {renderRepList("Prestige", prestige)}

        {renderRepList("Notoriety", notoriety)}
      </div>
    </div>
  );
}