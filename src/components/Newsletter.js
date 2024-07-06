
const NewsLetter = (props) => (
  <form>
    <div>
      <label>
        Email:
        <input
          type="email"
          name="userEmail"
          placeholder="jwebber@example.com"
          value={props.userEmail}
          onChange={props.handleEmailChange}
          style={{ marginLeft: "35px", border: "1px solid black" }}
        />
      </label>
    </div>
    <br />
    <div>
      <button
        role="submit"
        onClick={(event) => {
          event.preventDefault();
          props.setUserEmail("");
          // TODO: Lookup user in database and redirect them to home page (to the graph)
          // ? Maybe indicate that sign in was successful with a toast...
        }}
        style={{ background: "#999", padding: "9px" }}
      >
        Subscribe to the Folio Graph Newsletter
      </button>
    </div>
  </form>