import { useEffect, useState } from "react";
import { useParams, Link, Outlet } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import "./Root.css";


const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function CharacterPage() {
  const { id } = useParams();

  const [character, setCharacter] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [charmoves, setCharMoves] = useState([]);

  const [moneyAmount, setMoneyAmount] = useState(1);
  const [subtractMoney, setSubtractMoney] = useState(false);

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

    const { data: equipmentData } = await supabase
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

    setEquipment(equipmentData || []);

    const { data: charmovesData } = await supabase
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

    setCharMoves(charmovesData || []);
  }

  async function updateStat(statName, value) {
    const { error } = await supabase
      .from("Character")
      .update({
        [statName]: value
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setCharacter((prev) => ({
      ...prev,
      [statName]: value
    }));
  }

  async function changeMoney() {
    const currentMoney = character.Money || 0;

    const newMoney = subtractMoney
      ? Math.max(0, currentMoney - moneyAmount)
      : currentMoney + moneyAmount;

    const { error } = await supabase
      .from("Character")
      .update({
        Money: newMoney
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setCharacter((prev) => ({
      ...prev,
      Money: newMoney
    }));
  }

  function renderTrack(label, current, max, statName) {
    return (
      <div style={{ marginBottom: "16px" }}>
        <strong>{label}</strong>

        <div className="track">
          {[...Array(max)].map((_, i) => (
            <div
              key={i}
              className={`track-box ${
                i < current ? "filled" : ""
              }`}
              onClick={() =>
                updateStat(
                  statName,
                  i < current ? i : i + 1
                )
              }
            />
          ))}
        </div>
      </div>
    );
  }

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="character-sheet">
      <div className="sheet-container">
        <Link
        to={`/`}
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

        <div className="sheet-header">
          <h1 className="sheet-title">
            {character.Name}
          </h1>

          <div className="sheet-subtitle">
            The {character.Species} {character.Class}
          </div>
        </div>

        <div className="sheet-grid">
          {/* LEFT COLUMN */}
          <div>
            <div className="panel">
              <div className="panel-title">
                Stats
              </div>

              <div className="stat-list">
                {[
                  ["Charm", character.Charm],
                  ["Cunning", character.Cunning],
                  ["Finesse", character.Finesse],
                  ["Luck", character.Luck],
                  ["Might", character.Might]
                ].map(([name, value]) => (
                  <div
                    className="stat-row"
                    key={name}
                  >
                    <div className="stat-circle">
                      {value >= 0
                        ? `+${value}`
                        : value}
                    </div>

                    <strong>{name}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="panel"
              style={{ marginTop: "20px" }}
            >
              <div className="panel-title">
                Conditions
              </div>

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
            </div>

            <div
              className="panel"
              style={{ marginTop: "20px" }}
            >
              <div className="panel-title">
                Value
              </div>

              <h2 className="panel-title">
                {character.Money || 0}
              </h2>

              <input
                type="number"
                
                value={moneyAmount}
                onChange={(e) =>
                  setMoneyAmount(
                    Number(e.target.value) || 1
                  )
                }
              />

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={subtractMoney}
                    onChange={(e) =>
                      setSubtractMoney(
                        e.target.checked
                      )
                    }
                  />
                  Subtract
                </label>
              </div>

              <button onClick={changeMoney}>
                Apply
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <div className="panel">
              <div className="panel-title">
                Equipment
              </div>

              {equipment.length === 0 ? (
                <p>No equipment.</p>
              ) : (
                equipment.map((equip) => (
                  <div
                    key={equip.id}
                    className="equipment-item"
                  >
                    <strong>
                      {equip.Item?.name}
                    </strong>

                    <div>
                      Type: {equip.Item?.Type}
                    </div>

                    <div>
                      Load: {equip.Item?.Load}
                    </div>

                    <div>
                      Value:
                      {" "}
                      {equip.Item?.DefaultValue}
                    </div>

                    {equip.Notes && (
                      <div>
                        Notes: {equip.Notes}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div
              className="panel"
              style={{ marginTop: "20px" }}
            >
              <div className="panel-title">
                Roguish Feats
              </div>

              <div className="moves-list">
                {charmoves.map((move) => (
                  <div
                    key={move.id}
                    className="move-card"
                  >
                    <div>
                      
                      {" "}
                      <strong>
                        {move.Move?.Name}
                      </strong>
                    </div>

                    <div>
                      {move.Move?.Description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="panel"
              style={{ marginTop: "20px" }}
            >
              <Link to="reputation">
                Reputation
              </Link>
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}