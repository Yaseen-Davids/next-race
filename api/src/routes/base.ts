import { query } from "../knex";

const all =
  <T>(table: string) =>
  async (): Promise<T[]> => {
    return await query(table).select();
  };

const findBy =
  <T>(table: string) =>
  async (value: any, key: string = "id"): Promise<T> => {
    return await query(table).first().where(key, value);
  };

const create =
  <T>(table: string) =>
  async (data: Partial<T>): Promise<string> => {
    return await query(table).insert(data, "id");
  };

const update =
  <T>(table: string) =>
  async (id: string, data: Partial<T>): Promise<string> => {
    const [res] = await query(table).update(data, "id").where("id", id);
    return res.id;
  };

const remove =
  <T>(table: string) =>
  async (id: string): Promise<void> => {
    await query(table).where("id", id).del();
  };

const upsert =
  <T>(table: string) =>
  async (data: Partial<T & { id?: string }>): Promise<string> => {
    let id = data.id;
    delete data.id;

    if (!id || id === "") {
      const res = await query(table)
        .insert({ ...data })
        .returning("id");
      id = res[0].id;
    } else {
      await query(table)
        .update({ ...data })
        .where("id", id);
    }

    return id!;
  };

const findAll =
  <T>(table: string) =>
  async (value: any, key: string = "id"): Promise<T[]> => {
    return await query(table).select().where(key, value);
  };

export const repository = <T>(table: string) => ({
  all: all<T>(table),
  findBy: findBy<T>(table),
  create: create<T>(table),
  update: update<T>(table),
  remove: remove<T>(table),
  upsert: upsert<T>(table),
  findAll: findAll<T>(table),
});
