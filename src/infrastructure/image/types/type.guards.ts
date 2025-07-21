export interface Findable {
  findUnique: (args: {
    where: { id: number };
    select?: any;
  }) => Promise<{ id: number } | null>;
}
