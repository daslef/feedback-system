import React from "react";
import { useForm, useSelect } from "@refinedev/core";

export const CreateTopicCategoryTopic = () => {
  const { onFinish, mutation } = useForm({
    action: "create",
    resource: "topic_category_topics",
  });

  const { options: topicsOptions } = useSelect({
    resource: "topics",
    pagination: {
      pageSize: 48,
    },
  });

  const { options: categoriesOptions } = useSelect({
    resource: "topic_categories",
    pagination: {
      pageSize: 48,
    },
    // optionLabel: "title", // Default value is "title" so we don't need to provide it.
    // optionValue: "id", // Default value is "id" so we don't need to provide it.
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Using FormData to get the form values and convert it to an object.
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    // Calling onFinish to submit with the data we've collected from the form.
    onFinish({
      topic_category_id: Number(data.topic_category_id),
      topic_id: Number(data.topic_id),
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="topic_id">Topic</label>
      <select id="topic_id" name="topic_id">
        {topicsOptions?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label htmlFor="topic_category_id">Topic Category</label>
      <select id="topic_category_id" name="topic_category_id">
        {categoriesOptions?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {mutation.isSuccess && <span>successfully submitted!</span>}
      <button type="submit">Submit</button>
    </form>
  );
};
