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
    <ul>
      {Character.map((Char) => (
        <li key={Char.id}>
          <Link to={`/character/${Char.id}`}>
            {Char.Name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<CharacterList />} />

  <Route path="/character/:id" element={<CharacterPage />} />
<Route path="/character/:id/reputation" element={<RepPage />} />
</Routes>
    </BrowserRouter>
  );
}