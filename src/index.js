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
import Account from "./pages/Account";
import Profile from "./pages/Profile";
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
      { path: "account", element: <Account /> },
      { path: "profile", element: <Profile /> },
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
