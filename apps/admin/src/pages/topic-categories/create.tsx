import { useForm } from "@refinedev/core";

export const CreateTopicCategory = () => {
  const { onFinish, mutation } = useForm({
    action: "create",
    resource: "topic_categories",
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Using FormData to get the form values and convert it to an object.
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
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
