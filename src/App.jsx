import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import CharacterPage from "./CharacterPage";
import RepPage from "./RepPage";
import ItemList from "./ItemList";

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
    <div
      style={{
        padding: "24px",
        fontFamily: "Arial",
        color: "#000"
      }}
    >
      <div
        style={{
          border: "1px solid #000",
          background: "#fff",
          padding: "16px",
          borderRadius: "4px"
        }}
      >
        <h1 style={{ marginTop: 0 ,color: "#000"}}>Characters</h1>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {Character.map((Char) => (
            <li key={Char.id} style={{ marginBottom: "8px" }}>
              <Link
                to={`/character/${Char.id}`}
                style={{
                  display: "block",
                  padding: "8px",
                  border: "1px solid #000",
                  background: "#fff",
                  color: "#000",
                  textDecoration: "none"
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
        <Route path="/character/:id" element={<CharacterPage />} />
        <Route path="/character/:id/reputation" element={<RepPage />} />
      </Routes>
    </BrowserRouter>
  );
}