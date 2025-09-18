// TODO: rewrite as valibot schema

export interface PersonTypeTable {
  id: number;
  title: "citizen" | "official" | "moderator";
}
