import React from "react";
import { useLogin } from "@refinedev/core";

export const Login = () => {
  const {
    mutate,
    isPending,
  } = useLogin();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    mutate(data);
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          // We're providing default values for demo purposes.
          defaultValue="demo@example.com"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          defaultValue="password"
        />

        {isPending && <span>loading...</span>}
        <button type="submit" disabled={isPending}>
          Submit
        </button>
      </form>
    </div>
  );
};