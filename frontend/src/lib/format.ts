/** Money like the template: $29.99 */
export const money = (value: number) => `$${value.toFixed(2)}`;

/** Date like the template's delivery line: "Sep 25" */
export const shortDate = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
