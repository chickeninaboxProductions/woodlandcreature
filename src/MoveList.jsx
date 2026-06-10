import { Link } from "react-router-dom";

export default function MoveList() {
  return (
    <div
      style={{
        padding: "2px",
        fontFamily: "Arial",
        color: "#000"
      }}
    >
      



        <iframe
          src="public\PDFs\Moves.pdf"
          title="PDF Viewer"
          width="100%"
          height="650px"
          style={{
            border: "1px solid #000",
            borderRadius: "4px"
          }}
        />
      </div>

  );
}