import React from "react";
import { useForm } from "@refinedev/core";

export const CreateFeedbackTopic = () => {
  const { onFinish, mutation } = useForm({
    action: "create",
    resource: "topics",
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Using FormData to get the form values and convert it to an object.
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    // Calling onFinish to submit with the data we've collected from the form.
    onFinish({
      ...data,
      title: String(data.title),
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" />

      {mutation.isSuccess && <span>successfully submitted!</span>}
      <button type="submit">Submit</button>
    </form>
  );
};
