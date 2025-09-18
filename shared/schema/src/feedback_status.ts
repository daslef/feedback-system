// TODO: rewrite as valibot schema

export interface FeedbackStatusTable {
  id: number;
  title: "pending" | "approved" | "declined";
}
