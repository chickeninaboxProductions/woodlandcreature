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
    return <p style={{ color: "#000" }}>Loading...</p>;
  }

  function renderTrack(label, current, max, statName) {
    return (
      <div style={{ marginBottom: "18px" }}>
        <strong
          style={{
            display: "block",
            marginBottom: "6px",
            color: "#000"
          }}
        >
          {label}
        </strong>

        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap"
          }}
        >
          {[...Array(max)].map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const newValue =
                  index < current
                    ? index
                    : index + 1;

                updateStat(statName, newValue);
              }}
              style={{
                width: "28px",
                height: "28px",
                border: "1px solid #000",
                borderRadius: "0px",
                background:
                  index < current
                    ? "#000"
                    : "#fff",
                color:
                  index < current
                    ? "#fff"
                    : "#000",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {index + 1}
            </button>
          ))}
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
        to="/"
        style={{
          display: "inline-block",
          marginBottom: "20px",
          color: "#000",
          textDecoration: "none",
          border: "1px solid #000",
          padding: "4px 8px"
        }}
      >
        Back
      </Link>

      <div
        style={{
          border: "1px solid #000",
          borderRadius: "4px",
          padding: "18px",
          background: "#fff"
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: "6px",
            color:"black"
          }}
        >
          {character.Name}
        </h1>

        <p style={{ marginTop: 0 ,color:"black"}}>
          The {character.Species} {character.Class}
        </p>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "10px",
            marginTop: "20px",
            marginBottom: "24px"
          }}
        >
          {[
            ["Charm", character.Charm],
            ["Cunning", character.Cunning],
            ["Finesse", character.Finesse],
            ["Luck", character.Luck],
            ["Might", character.Might]
          ].map(([name, value]) => (
            <div
              key={name}
              style={{
                border: "1px solid #000",
                padding: "10px",
                textAlign: "center"
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  marginBottom: "4px"
                }}
              >
                {name}
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "bold"
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* TRACKS */}
        {renderTrack(
          "Injury",
          character.Injury,
          character.MAX_I,
          "Injury"
        )}

        {renderTrack(
          "Exhaustion",
          character.Exhaustion,
          character.MAX_E,
          "Exhaustion"
        )}

        {renderTrack(
          "Depletion",
          character.Depletion,
          character.MAX_D,
          "Depletion"
        )}

        {/* LINKS */}
        <div style={{ marginTop: "24px" }}>
          <Link
            to="reputation"
            style={{
              color: "#000",
              textDecoration: "none",
              border: "1px solid #000",
              padding: "6px 10px",
              display: "inline-block"
            }}
          >
            Reputation
          </Link>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}