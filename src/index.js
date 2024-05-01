// import React from "react";
// import ReactDOM from "react-dom/client";
// // import Home from "./App";
// import reportWebVitals from "./reportWebVitals";

// import "./index.css";
// import { useState, useEffect, useRouter } from "react";
// import { createClient } from "@supabase/supabase-js";

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./pages/Layout";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import SignInPage from "./pages/SignInPage";
// import SignUpPage from "./pages/SignUpPage";
// import EmailConfirmation from "./pages/EmailConfirmation";

// // import NoPage from "./pages/NoPage";

// const supabase = createClient(
//   "https://qsajpsacfswygykjjprc.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYWpwc2FjZnN3eWd5a2pqcHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NzQ3NDQsImV4cCI6MjAyNTE1MDc0NH0.HRIYU6c6A14qBb-mqGJpklJ1EgV0_kazEAo8qQ9ADZg"
// );

// export default function App() {
//   const [session, setSession] = useState(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Layout user={session} supabase={supabase} />}>
//           <Route index element={<Home user={session} />} />
//           <Route path="about" element={<About />} />
//           <Route path="signin" element={<SignInPage supabase={supabase} />} />
//           <Route
//             path="signup"
//             element={<SignUpPage supabase={supabase} setSession={setSession} />}
//           />
//           <Route
//             path="/auth/confirm"
//             element={<EmailConfirmation supabase={supabase} />}
//           />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);

// // export default function App() {

// //   return <Home  />;
// //   // if (!session) {
// //   //   console.log("no session?");
// //   //   return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
// //   // } else {
// //   //   console.log("session detected?");
// //   //   return <div>Logged in!</div>;
// //   // }
// // }

// // const root = ReactDOM.createRoot(document.getElementById("root"));
// // root.render(
// //   <React.StrictMode>
// //     <App />
// //   </React.StrictMode>
// // );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AddAssets from "./pages/AddAssets";
import EmailConfirmation from "./pages/EmailConfirmation";
import reportWebVitals from "./reportWebVitals";

import AuthProvider from "./components/AuthProvider.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "addAssets", element: <AddAssets /> },
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
      {
        path: "auth/confirm",
        element: <EmailConfirmation />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
