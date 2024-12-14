"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import RegistrationsTable from "./registrationsTable/RegistrationsTable";
import { Button } from "./ui/button";

function postLogin(password: string) {
  return fetch("/api/admin", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

const AdminLogin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);
  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => postLogin(password),
    onSuccess: async (res) => {
      if (res.ok) {
        setLoggedIn(true);
        setData(
          (await res.json()).filter(
            (row: { program: { name: string } }) => row.program
          )
        );
      } else {
        throw new Error("Incorrect password");
      }
    },
  });

  if (!loggedIn) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "20rem",
          margin: "auto",
          marginTop: "2rem",
        }}
      >
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Button onClick={() => mutate()}>
          {isPending ? "Loading..." : "Login"}
        </Button>
        {isError && (
          <p
            style={{
              color: "red",
              textAlign: "center",
            }}
          >
            Incorrect password
          </p>
        )}
      </div>
    );
  }

  return <RegistrationsTable registrations={data} />;
};

export default AdminLogin;
