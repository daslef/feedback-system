import React from "react";
import { useRegister } from "@refinedev/core";

export const Register = () => {
  const { mutate, isPending } = useRegister();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    mutate(data);
  };

  return (
    <div>
      <h1>Регистрация</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="new-email">Email</label>
        <input
          type="email"
          id="new-email"
          name="email"
          // We're providing default values for demo purposes.
          defaultValue="demo@example.com"
        />

        <label htmlFor="new-password">Password</label>
        <input
          type="password"
          id="new-password"
          name="password"
          defaultValue="password"
        />

        {isPending && <span>loading...</span>}
        <button type="submit" disabled={isPending}>
          Получить аккаунт
        </button>
      </form>
    </div>
  );
};
