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
  const [drives, setDrives] = useState([]);
  const [classMoves, setClassMoves] = useState([]);
  const [connections, setConnections] = useState([]);
  const [moneyAmount, setMoneyAmount] = useState(1);
  const [subtractMoney, setSubtractMoney] = useState(false);
  const totalLoad = equipment.reduce((sum, e) => {
  return sum + (e.Item?.Load || 0);
}, 0);

const burdened = 4 + (character?.Might || 0);
const maxLoad = burdened * 2;
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
    const { data: connectionData } = await supabase
  .from("Connection")
  .select(`
    id,
    Type,
    Effect,
    Character2 (
      id,
      Name
    )
  `)
  .eq("Character1", id);

setConnections(connectionData || []);
const { data: classMovesData } = await supabase
  .from("ClassMoves")
  .select(`
    id,
    Name,
    Description,
    IsChecked
  `)
  .eq("Character", id);

setClassMoves(classMovesData || []);
    const { data: equipmentData } = await supabase
      .from("Equipement")
      .select(`
        id,
        Notes,
        Wear,
        Item (
          id,
          name,
          Type,
          Load,
          Range,
          Harm,
          MAX_W,
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

    const { data: drivesData } = await supabase
  .from("Drives")
  .select(`
    id,
    Name,
    Description
  `)
  .eq("Character", id);

setDrives(drivesData || []);
  }
  

  async function updateStat(statName, value, table, rowId) {
  const { error } = await supabase
    .from(table)
    .update({
      [statName]: value
    })
    .eq("id", rowId);

  if (error) {
    console.error(error);
    return;   
  }
  getCharacter();
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

  function renderTrack(label, current, max, statName,table, rowId) {
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
                  i < current ? i : i + 1,
                  table,
                  rowId
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
          marginBottom: "0px",
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
  className="sheet-header"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px"
  }}
>
  <div>
    <h1 className="sheet-title"style={{
      paddingBottom:"20px"
  }}>
      {character.Name}
    </h1>

    <div className="panel-title">
  The {character.Species} {character.Class}
</div>

<div
  style={{
    marginTop: "8px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  }}
>
  {drives.map((drive) => (
    <span
      key={drive.id}
      title={drive.Description}
      className="panel"
      style={{
        padding: "2px 8px",

        cursor: "help",
        fontSize: "0.9rem"
      }}
    >
      <strong>{drive.Name}</strong>
    </span>
  ))}
  
</div>
  </div>
  

  <div
    className="panel"
    style={{
      maxWidth: "70%",
      margin: 0
    }}
  >
    <div className="panel-title">
      Nature
    </div>

    <strong>{character.Nature}</strong>

    <div style={{ marginTop: "8px" }}>
      
      {character.NatureDescription}
    </div>
  </div>
</div>

        <div className="sheet-grid">
          {/* LEFT COLUMN */}
          <div>
            {connections.length > 0 && (
  <div className="panel">
    <strong>Connections:</strong>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        marginTop: "4px"
      }}
    >
      {connections.map((connection) => (
        <div
          key={connection.id}
          title={connection.Effect || ""}
          style={{
            cursor: connection.Effect ? "help" : "default"
          }}
        >
          {connection.Type} with {connection.Character2?.Name}
        </div>
      ))}
    </div>
  </div>
)}
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
                "Injury",
                "Character",
                character.id
              )}

              {renderTrack(
                "Exhaustion",
                character.Exhaustion,
                character.MAX_E,
                "Exhaustion",
                "Character",
                character.id
              )}

              {renderTrack(
                "Depletion",
                character.Depletion,
                character.MAX_D,
                "Depletion",
                "Character",
                character.id
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
              style={{ marginTop: "20px", color: "#000",
              textDecoration: "none" }}
            >
              <Link style={{ marginTop: "20px", color: "#000",
              textDecoration: "none" }} to="reputation">
                Reputation
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <div
  className="panel"
  style={{ marginTop: "20px" }}
>
  <div className="panel-title">
    Class Moves
  </div>

  {classMoves.length === 0 ? (
    <p>No class moves.</p>
  ) : (
    classMoves.map((move) => (
      <div
        key={move.id}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "8px",
          marginBottom: "8px"
        }}
      >
        <input
          type="checkbox"
          checked={move.IsChecked}
          onChange={() =>
            toggleClassMove(
              move.id,
              move.IsChecked
            )
          }
        />

        <div>
          <strong>{move.Name}</strong>

          <div
            style={{
              fontSize: "0.9rem",
              opacity: 0.8
            }}
          >
            {move.Description}
          </div>
        </div>
      </div>
    ))
  )}
</div>
            <div className="panel">
  <div
    className="panel-title"
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px"
    }}
  >
    <span>Equipment</span>

    <span
      style={{
        fontSize: "0.85rem",
        fontWeight: "normal",
        border: "1px solid #000",
        padding: "2px 6px"
      }}
    >
      Load: {totalLoad} / {maxLoad}
      {" "}
      (Burdened: {burdened})
    </span>
  </div>

              {equipment.length === 0 ? (
                <p>No equipment.</p>
              ) : (
                equipment.sort((a, b) => a.id - b.id).map((equip) => (
                  <div
                    key={equip.id}
                    className="equipment-item"
                  >
                    <strong>
                      {equip.Item?.name}

                    </strong>
                    {renderTrack(
                "Wear",
                equip.Wear,
                equip.Item?.MAX_W,
                "Wear",
                "Equipement",
                equip.id
              )}

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
        </div>

        <Outlet />
      </div>
    </div>
  );
}