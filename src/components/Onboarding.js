import React from "react";

const SignUpForm = (props) => (
  <>
    <form>
      <div>
        <label>
          Email:
          <input
            type="email"
            placeholder="jwebber@example.com"
            value={props.userEmail}
            onChange={props.handleEmailChange}
            style={{ marginLeft: "35px", border: "1px solid black" }}
          />
        </label>
      </div>
      <div>
        <label>
          Password:{" "}
          <input
            type="password"
            placeholder="enter password here"
            value={props.userPassword}
            onChange={props.handlePasswordChange}
            style={{ border: "1px solid black" }}
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
          Sign up
        </button>
      </div>
      <br />
      <p>
        Already a user?{" "}
        <span
          onClick={() => props.setIsARegisteredUser(true)}
          style={{ textDecoration: "underline" }}
        >
          Sign In
        </span>
      </p>
    </form>
  </>
);

const SignInForm = (props) => (
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
    <div>
      <label>
        Password:{" "}
        <input
          type="password"
          placeholder="enter password here"
          value={props.userPassword}
          onChange={props.handlePasswordChange}
          style={{ border: "1px solid black" }}
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
        Sign in
      </button>
    </div>
    <br />
    <p>
      Not registered?{" "}
      <span
        onClick={() => props.setIsARegisteredUser(false)}
        style={{ textDecoration: "underline" }}
      >
        Sign up instead
      </span>
    </p>
  </form>
);

/* This component weaves together the SignIn and SignUp forms, presenting the user with the option to choose to register or sign in. */
const OnboardingForm = (props) => {
  const [isARegisteredUser, setIsARegisteredUser] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");

  const handleEmailChange = (event) => setUserEmail(event.target.value);
  const handlePasswordChange = (event) => setUserPassword(event.target.value);

  return isARegisteredUser ? (
    <SignInForm
      setIsARegisteredUser={setIsARegisteredUser}
      userEmail={userEmail}
      setUserEmail={setUserEmail}
      handleEmailChange={handleEmailChange}
      password={userPassword}
      setPassword={setUserPassword}
      handlePasswordChange={handlePasswordChange}
    />
  ) : (
    <SignUpForm
      setIsARegisteredUser={setIsARegisteredUser}
      userEmail={userEmail}
      setUserEmail={setUserEmail}
      handleEmailChange={handleEmailChange}
      password={userPassword}
      setPassword={setUserPassword}
      handlePasswordChange={handlePasswordChange}
    />
  );
};

export { SignInForm, SignUpForm, OnboardingForm };
