import React from "react";
import { useLogout, useGetIdentity } from "@refinedev/core";

export default function Header() {
  const { mutate, isPending } = useLogout();
  const { data: identity } = useGetIdentity();

  console.log(identity);

  return (
    <>
      <button type="button" disabled={isPending} onClick={mutate}>
        <span>{identity?.name ?? ""}</span>, wanna Logout ?
      </button>
    </>
  );
}
