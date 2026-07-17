import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./Root.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function ItemList() {
  const [items, setItems] = useState([]);
const [selectedTag, setSelectedTag] = useState(null);

const [selectedType, setSelectedType] = useState("All");

const [maxCost, setMaxCost] = useState(15);

const [sortBy, setSortBy] = useState("name");
  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data, error } = await supabase.from("Item").select(`
      id,
      name,
      Type,
      DefaultValue,
      MAX_W,
      Range,
      Load,
      ItemTags (
        Tags (
          Name,
          Description,
          Positivity
        )
      ),
      WeaponSkill (
        Moves (
          Name
        )
      )
    `);

    if (error) {
      console.error(error);
      return;
    }

    setItems(data);
  }

  const getTagStyle = (positivity) => {
    if (positivity === true) return { background: "#d1fae5", color: "#000" };
    if (positivity === false) return { background: "#fee2e2", color: "#000" };
    return { background: "#e5e7eb", color: "#000" };
  };


const itemTypes = [
  "All",
  ...new Set(items.map(item => item.Type).filter(Boolean))
];
const filteredItems = [...items]
  .filter(item => {
    // TAG FILTER
    if (
      selectedTag &&
      !item.ItemTags?.some(
        t => t.Tags?.Name === selectedTag
      )
    ) {
      return false;
    }

    // TYPE FILTER
    if (
      selectedType !== "All" &&
      item.Type !== selectedType
    ) {
      return false;
    }

    // COST FILTER
    if (
      item.DefaultValue > maxCost
    ) {
      return false;
    }

    return true;
  })
  .sort((a, b) => {
    switch (sortBy) {
      case "wearAsc":
        return a.MAX_W - b.MAX_W;

      case "wearDesc":
        return b.MAX_W - a.MAX_W;

      case "costAsc":
        return a.DefaultValue - b.DefaultValue;

      case "costDesc":
        return b.DefaultValue - a.DefaultValue;

      default:
        return a.name.localeCompare(b.name);
    }
  });
  return (
    <div className="character-sheet">
            <h1 className="sheet-title" style={{ marginBottom: "10px",marginTop: "-10px" }}>Items</h1>
      <div className="panel">
        
        
  <strong>Type:</strong>{" "}

  <select
    value={selectedType}
    onChange={(e) => setSelectedType(e.target.value)}
  >
    {itemTypes.map(type => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
  <br />
    <strong>Max Cost:</strong> {maxCost}
  <input
    type="range"
    min="0"
    max="15"
    value={maxCost}
    onChange={(e) =>
      setMaxCost(Number(e.target.value))
    }
    style={{ width: "300px" }}
  />
  <br />
  <strong>Sort:</strong>{" "}

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="name">Name</option>

    <option value="wearAsc">
      Wear ↓
    </option>

    <option value="wearDesc">
      Wear ↑
    </option>

    <option value="costAsc">
      Cost ↓
    </option>

    <option value="costDesc">
      Cost ↑
    </option>
  </select>
</div>



  




      <div  style={{ display: "grid", gap: "12px" }}>
        {filteredItems.map((item) => (
          <div
            key={item.id}

              className="panel"

          >
            <h2 className="panel-title">
              {item.name}
            </h2>
            <div>
              Id: {item.id}
            </div>

            <p><strong>Type:</strong> {item.Type}</p>
            <p><strong>Average Cost:</strong> {item.DefaultValue} Doubloons</p>
            <p><strong>Wear:</strong> {item.MAX_W}</p>
            <p><strong>Range:</strong> {item.Range}</p>
            <p><strong>Load:</strong> {item.Load}</p>

            <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
  <strong>Tags:</strong>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      alignItems: "center"
    }}
  >
    {item.ItemTags?.length ? (
      item.ItemTags.map((t, i) => {
        const tag = t.Tags;

        return (
          <button
            key={i}
            onClick={() =>
              setSelectedTag(
                selectedTag === tag?.Name ? null : tag?.Name
              )
            }
            title={tag?.Description || ""}
            style={{
              padding: "3px 6px",
              border: "1px solid #000",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              background:
                selectedTag === tag?.Name
                  ? "#000"
                  : getTagStyle(tag?.Positivity).background,
              color: selectedTag === tag?.Name ? "#fff" : "#000"
            }}
          >
            {tag?.Name}
          </button>
        );
      })
    ) : (
      <span>None</span>
    )}
  </div>
</div>

            {/* MOVES */}
            <p style={{ marginTop: "10px" }}>
              <strong>Moves:</strong>{" "}
              {item.WeaponSkill?.map((m) => m.Moves?.Name).join(", ") || "None"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}