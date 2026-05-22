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
    const [{ data: factionsData }, { data: prestigeData }, { data: notorietyData }] =
      await Promise.all([
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

  return (
    <div>
      <Link to={`/character/${characterId}`}>
        ← Back
      </Link>

      <h1>Reputation</h1>
      <h2>Prestige</h2>

      <ul>
        {factions.map((faction) => {
          const match = prestige.find(
            (p) => p.Faction === faction.id
          );

          return (
            <li key={faction.id}>
              <strong>{faction.Name}</strong>:{" "}
              {match ? match.Level : 0}
            </li>
          );
        })}
      </ul>
      <h2>Notoriety</h2>
      <ul>
        {factions.map((faction) => {
          const match = notoriety.find(
            (p) => p.Faction === faction.id
          );

          return (
            <li key={faction.id}>
              <strong>{faction.Name}</strong>:{" "}
              {match ? match.Level : 0}
            </li>
          );
        })}
      </ul>
    </div>
  );
}