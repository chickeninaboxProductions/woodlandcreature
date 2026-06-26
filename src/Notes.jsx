import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import "./Root.css";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export default function Notes() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [notes, setNotes] = useState([]);

  const [newSubject, setNewSubject] = useState("");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) loadNotes(selectedSubject.id);
  }, [selectedSubject]);

  async function loadSubjects() {
    const { data } = await supabase
      .from("Subject")
      .select("*")
      .order("Name");

    setSubjects(data || []);
  }

  async function loadNotes(subjectId) {
    const { data } = await supabase
      .from("Notes")
      .select("*")
      .eq("SubjectID", subjectId)
      .order("created_at");

    setNotes(data || []);
  }

  async function addSubject() {
    if (!newSubject.trim()) return;

    const { error } = await supabase
      .from("Subject")
      .insert({
        Name: newSubject
      });

    if (!error) {
      setNewSubject("");
      loadSubjects();
    }
  }

  async function addNote() {
    if (!selectedSubject) return;
    if (!newNote.trim()) return;

    const { error } = await supabase
      .from("Notes")
      .insert({
        SubjectID: selectedSubject.id,
        Description: newNote
      });

    if (!error) {
      setNewNote("");
      loadNotes(selectedSubject.id);
    }
  }

  async function deleteNote(id) {
    await supabase
      .from("Notes")
      .delete()
      .eq("id", id);

    loadNotes(selectedSubject.id);
  }

  return (
    <div className="character-sheet">
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
        className="panel"
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start"
        }}
      >
        {/* Subjects */}
        <div style={{ width: "250px" }}>
          <h2 className="sheet-title">NOTES</h2>

          <div style={{ display: "flex", gap: "5px" }}>
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="New subject"
              style={{ flex: 1 }}
            />
            <button onClick={addSubject}>+</button>
          </div>

          <div style={{ marginTop: "15px" }}>
            {subjects.map((subject) => (
              <div 
                key={subject.id}
                onClick={() => setSelectedSubject(subject)}
                style={{
                  cursor: "pointer",
                  padding: "8px",
                  marginBottom: "4px",
                  border: "1px solid black",
                  background:
                    selectedSubject?.id === subject.id
                      ? "#ddd"
                      : "white"
                }}
              >
                {subject.Name}
              </div>
            ))}
          </div>

        </div>

        {/* Notes */}
        <div style={{ flex: 1 }}>
          <h2 className="panel-title">
            {selectedSubject
              ? selectedSubject.Name
              : "Select a subject"}
          </h2>

          {selectedSubject && (
            <>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
                placeholder="Write a note..."
                style={{
                  width: "100%",
                  marginBottom: "10px"
                }}
              />

              <button onClick={addNote}>
                Add Note
              </button>

              <hr />

              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    marginBottom: "10px"
                  }}
                >
                  <div>{note.Description}</div>

                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}