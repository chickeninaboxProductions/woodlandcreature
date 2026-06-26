import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import "./Root.css";
import CharacterPage from "./CharacterPage";
import RepPage from "./RepPage";
import ItemList from "./ItemList";
import MoveList from "./MoveList";
import Notes from "./Notes";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

function CharacterList() {
  const [Character, setCharacter] = useState([]);

  useEffect(() => {
    getCharacter();
  }, []);

  async function getCharacter() {
    const { data, error } = await supabase
      .from("Character")
      .select();

    if (error) {
      console.error(error);
      return;
    }

    setCharacter(data);
  }

  return (
    <div className="character-sheet">
      <div className="panel">
      
        <h1 className="sheet-title" style={{ marginBottom: "10px",marginTop: "-10px" }}>Party</h1>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {[...Character]
  .sort((a, b) => a.id - b.id)
  .map((Char) => (
    <li key={Char.id} style={{ marginBottom: "8px" }}>
      <Link
        to={`/character/${Char.id}`}
        className="panel"
        style={{
          display: "block",
          padding: "8px",
          border: "1px solid #000",
          color: "#000",
          textDecoration: "none",
        }}
      >
        {Char.Name}
      </Link>
    </li>
  ))}
        </ul>

        {/* NAV BUTTON */}
        <div style={{ marginTop: "16px" }}>
          <Link
            to="/ItemList"
            style={{
              display: "inline-block",
              padding: "6px 10px",
              border: "1px solid #000",
              background: "#fff",
              color: "#000",
              textDecoration: "none"
            }}
          >
            Item List
          </Link>
        
        </div>
        <div style={{ marginTop: "16px" }}>
          <Link
            to="/MoveList"
            style={{
              display: "inline-block",
              padding: "6px 10px",
              border: "1px solid #000",
              background: "#fff",
              color: "#000",
              textDecoration: "none"
            }}
          >
            Move List
          </Link>
        
        </div>
        <div style={{ marginTop: "16px" }}>
  <Link
    to="/Notes"
    style={{
      display: "inline-block",
      padding: "6px 10px",
      border: "1px solid #000",
      background: "#fff",
      color: "#000",
      textDecoration: "none"
    }}
  >
    Notes
  </Link>
</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharacterList />} />
        <Route path="/ItemList" element={<ItemList />} />
        <Route path="/MoveList" element={<MoveList />} />
        <Route path="/Notes" element={<Notes />} />
        <Route path="/character/:id" element={<CharacterPage />} />
        <Route path="/character/:id/reputation" element={<RepPage />} />
      </Routes>
    </BrowserRouter>
  );
}