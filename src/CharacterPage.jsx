
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
  const [equipment, setEquipment] = useState([]);
  const [charmoves, setCharMoves] = useState([]);

  const headerStyle = {
    textAlign: "left",
    fontWeight: "bold",
    color: "#000",
    border: "solid black 1px",
    padding: "3px"
  };

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

    const { data: equipmentData, error: equipmentError } = await supabase
      .from("Equipement")
      .select(`
        id,
        Notes,
        Item (
          id,
          name,
          Type,
          Load,
          Range,
          Harm,
          DefaultValue
        )
      `)
      .eq("Character", id);

    if (equipmentError) {
      console.error(equipmentError);
    } else {
      setEquipment(equipmentData || []);
    }

    const { data: charmovesData, error: charmovesError } = await supabase
  .from("CharacterMoves")
  .select(`
    id,
    Move (
      id,
      Name,
      Description,
      Roll
    )
  `)
  .eq("Character", id);

    if (charmovesError) {
      console.error(charmovesError);
    } else {
      setCharMoves(charmovesData || []);
    }
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

  if (!character) {
    return <p style={{ color: "#000" }}>Loading...</p>;
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
        <h1 style={{ marginTop: 0, color: "#000" }}>
          {character.Name}
        </h1>

        <p style={{ color: "#000" }}>
          The {character.Species} {character.Class}
        </p>

        {/* Stats */}
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
              <div>{name}</div>
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

        {/* Tracks */}
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

        {/* Equipment */}
        <div style={{ marginTop: "24px" }}>
          <h2 style={{ color: "#000" }}>Equipment</h2>

          {equipment.length === 0 ? (
            <p>No equipment equipped.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse"
              }}
            >
              <thead>
                <tr>
                  <th style={headerStyle}>Name</th>
                  <th style={headerStyle}>Type</th>
                  <th style={headerStyle}>Load</th>
                  <th style={headerStyle}>Value</th>
                  <th style={headerStyle}>Notes</th>
                </tr>
              </thead>

              <tbody>
                {equipment.map((equip) => (
                  <tr key={equip.id}>
                    <td style={headerStyle}>{equip.Item?.name}</td>
                    <td style={headerStyle}>{equip.Item?.Type}</td>
                    <td style={headerStyle}>{equip.Item?.Load}</td>
                    <td style={headerStyle}>{equip.Item?.DefaultValue}</td>
                    <td style={headerStyle}>{equip.Notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Moves */}
        <div style={{ marginTop: "24px" }}>
          <h2 style={{ color: "#000" }}>Moves</h2>

          {charmoves.length === 0 ? (
            <p>No moves.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse"
              }}
            >
              <thead>
                <tr>
                  <th style={headerStyle}>Name</th>
                  <th style={headerStyle}>Description</th>
                  <th style={headerStyle}>Roll</th>

                </tr>
              </thead>

              <tbody>
                {charmoves.map((move) => (
                  <tr key={move.id}>
                    <td style={headerStyle}>{move.Move?.Name}</td>
                    <td style={headerStyle}>{move.Move?.Description}</td>
                    <td style={headerStyle}>{move.Move?.Roll}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ marginTop: "24px" }}>
          <Link to="reputation">
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
