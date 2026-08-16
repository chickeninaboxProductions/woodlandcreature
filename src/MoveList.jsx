import { Link } from "react-router-dom";

export default function MoveList() {
  return (
    <div
      style={{
        padding: "2px",
        fontFamily: "Arial",
        color: "#000"
      }}
    ><Link
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
      



        <iframe
          src="https://woodlandcreature-olrp.vercel.app/PDFs/Moves.pdf"
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