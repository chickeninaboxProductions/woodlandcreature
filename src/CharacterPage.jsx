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

  if (!character) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link to="/">Back</Link>

      <h1>{character.Name}</h1>
      <p>The {character.Species} {character.Class}</p>
      Injury
      {[...Array(character.MAX_I)].map((_, index) => (
        <label key={index}>
          <input type="checkbox" />
        </label>
      ))}
      <br/>
      Exhaustion
      {[...Array(character.MAX_E)].map((_, index) => (
        <label key={index}>
          <input type="checkbox" />
        </label>
      ))}
      <br/>
      Depletion
      {[...Array(character.MAX_D)].map((_, index) => (
        <label key={index}>
          <input type="checkbox" />
        </label>
      ))}
      <br/>
      <Link to="reputation">Reputation</Link>
      <Outlet />

    </div>
  );
}