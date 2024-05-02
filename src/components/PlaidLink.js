import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useAuth } from "../components/AuthProvider";
// // import { insertAccountsData, insert_item_data } from "./actions";
// import { GoogleAuth } from "google-auth-library";

const is_past_date = (dateString) => {
  if (!dateString) return true;
  const dateObject = new Date(dateString);
  const currentDate = new Date();

  return currentDate > dateObject;
};

const PlaidLink = () => {
  const [token, setLinkToken] = useState(null);
  const [linkTokenExpiry, setLinkTokenExpiry] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const { user } = useAuth();
  useEffect(() => {
    const createLinkToken = async () => {
      try {
        // const url =
        //   "https://us-east1-nonprod1-svc-pd7p.cloudfunctions.net/";
        // const auth = new GoogleAuth();
        // const client = await auth.getIdTokenClient(url);
        // const response = await client.request({ url: url });
        // console.log(response);
        // const response = await fetch("/api/cloudFunctionCall", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     url:,
        //   }),
        // });

        const response = await fetch("/create_link_token_public", {
          method: "GET",
        });
        console.log(response);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`); // Handle errors appropriately
        }
        const data = await response.json(); // Assuming your API returns the link token in JSON format
        console.log(data);
        setLinkToken(data.link_token); // Set the received link token to your state
        setLinkTokenExpiry(data.expiration);
      } catch (error) {
        console.error("Failed to create link token:", error);
      }
    };

    if (!token || is_past_date(linkTokenExpiry)) {
      createLinkToken();
    }
  }, []);

  const onSuccess = async (publicToken, metadata) => {
    console.log(publicToken, metadata);
    try {
      // Assuming your API route is '/api/auth' and it handles obtaining the access token
      // and calling the cloud function
      const response = await fetch("/exchange_public_token_public2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicToken: publicToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`); // Handle errors appropriately
      }

      const data = await response.json(); // Assuming your API returns the link token in JSON format
      console.log(data);
      //   const token = ;

      console.log(data.access_token);
      console.log(data.accessToken);

      const response2 = await fetch(
        "/extract_investment_info_to_supabase_public2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: data.access_token,
            user_id: user.id,
          }),
        }
      );

      console.log(response2);

      //   if (!response.ok) {
      //     throw new Error(`Error: ${response.status}`); // Handle errors appropriately
      //   }
      //   const data2 = await response2.json();
      //   const accounts = data2.data.accounts;
      //   console.log(accounts);
      //   //   for (let i = 0; i < accounts.length; i++) {
      //   //     insertAccountsData(accounts[i], user);
      //   //   }
      //   console.log("account data inserted");
    } catch (error) {
      console.error("Failed to create link token:", error);
    }
  };

  const onEvent = (eventName, metadata) => {
    // log onEvent callbacks from Link
    // https://plaid.com/docs/link/web/#onevent
    console.log(eventName, metadata);
  };

  const onExit = (error, metadata) => {
    // log onExit callbacks from Link, handle errors
    // https://plaid.com/docs/link/web/#onexit
    console.log(error, metadata);
  };

  const config = {
    token,
    onSuccess,
    onEvent,
    onExit,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="CustomButton"
      style={{
        padding: "20px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: !ready ? "gray" : "green", // This line changes the background color
        color: "white", // Set text color to white for better readability
      }}>
      Link your bank account
    </button>
  );
};

export { PlaidLink };
