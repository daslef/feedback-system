import { useForm, useSelect } from "@refinedev/core";

export const EditProject = () => {
  const { onFinish, mutation, query } = useForm({
    action: "edit",
    resource: "projects",
    id: 730,
  });

  const record = query?.data?.data;

  const { options } = useSelect({
    resource: "administrative_units",
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    // Calling onFinish to submit with the data we've collected from the form.
    onFinish({
      ...data,
      price: Number(data.price).toFixed(2),
      category: { id: Number(data.category) },
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="title">Название</label>
      <input type="text" id="title" name="title" defaultValue={record?.title} />

      <label htmlFor="latitude">Latitude</label>
      <input
        type="text"
        id="latitude"
        name="latitude"
        pattern="\d*\.\d*"
        defaultValue={record?.latitude}
      />

      <label htmlFor="longitude">Longitude</label>
      <input
        type="text"
        id="longitude"
        name="longitude"
        pattern="\d*\.\d*"
        defaultValue={record?.longitude}
      />

      <label htmlFor="year_of_completion">Год реализации</label>
      <input
        type="text"
        id="year_of_completion"
        name="year_of_completion"
        pattern="20[12]\d"
        defaultValue={record?.year_of_completion}
      />

      <label htmlFor="administrative_unit">Местоположение</label>
      <select id="administrative_unit" name="administrative_unit">
        {options?.map((option) => (
          <option
            key={option.value}
            value={option.value}
            selected={record?.administrative_unit_id == option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {mutation.isSuccess && <span>successfully submitted!</span>}
      <button type="submit">Submit</button>
    </form>
  );
};
