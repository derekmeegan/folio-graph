import React from "react";

export default function NewsLetter(props) {
  const [userEmail, setUserEmail] = React.useState("");

  const handleChange = (event) => {
    setUserEmail(event.target.value);
  };

  return (
    <form>
      <div>
        <label>
          Email:
          <input
            type="email"
            name="userEmail"
            placeholder="jwebber@example.com"
            value={userEmail}
            onChange={handleChange}
            style={{
              marginLeft: "35px",
              border: "1px solid black",
              color: "black",
            }}
          />
        </label>
      </div>
      <br />
      <div>
        <button
          role="submit"
          onClick={(event) => {
            event.preventDefault();
            setUserEmail("");
          }}
          style={{ background: "#999", padding: "9px" }}
        >
          Subscribe to the Folio Graph Newsletter
        </button>
      </div>
    </form>
  );
}
