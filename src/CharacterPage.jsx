import { useEffect, useState } from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function CharacterPage() {
  const { id } = useParams();

  const [character, setCharacter] = useState(null);

  useEffect(() => {
    getCharacter();
  }, []);

  async function getCharacter() {
    const { data, error } = await supabase
      .from("Character")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setCharacter(data);
  }

  async function updateStat(statName, value) {
    const { error } = await supabase
      .from("Character")
      .update({
        [statName]: value,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setCharacter((prev) => ({
      ...prev,
      [statName]: value,
    }));
  }

  if (!character) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/">Back</Link>

      <h1>{character.Name}</h1>

      <p>
        The {character.Species} {character.Class}
      </p>
      <h2>Charm {character.Charm}</h2>
      <h2>Cunning {character.Cunning}</h2>
      <h2>Finesse {character.Finesse}</h2>
      <h2>Luck {character.Luck}</h2>
      <h2>Might {character.Might}</h2>

      {/* Injury */}
      <div>
        <strong>Injury</strong>

        {[...Array(character.MAX_I)].map((_, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={index < character.Injury}
              onChange={() => {
                const newValue =
                  index < character.Injury
                    ? index
                    : index + 1;

                updateStat("Injury", newValue);
              }}
            />
          </label>
        ))}
      </div>

      <br />

      {/* Exhaustion */}
      <div>
        <strong>Exhaustion</strong>

        {[...Array(character.MAX_E)].map((_, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={index < character.Exhaustion}
              onChange={() => {
                const newValue =
                  index < character.Exhaustion
                    ? index
                    : index + 1;

                updateStat("Exhaustion", newValue);
              }}
            />
          </label>
        ))}
      </div>

      <br />

      {/* Depletion */}
      <div>
        <strong>Depletion</strong>

        {[...Array(character.MAX_D)].map((_, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={index < character.Depletion}
              onChange={() => {
                const newValue =
                  index < character.Depletion
                    ? index
                    : index + 1;

                updateStat("Depletion", newValue);
              }}
            />
          </label>
        ))}
      </div>

      <br />

      <Link to="reputation">Reputation</Link>

      <Outlet />
    </div>
  );
}