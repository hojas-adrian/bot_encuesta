const kv = await Deno.openKv();

export const setKv = async ({
  field,
  id,
  value,
}: {
  field: "pollMessageId";
  id: number;
  value: { count: number; votes: number[] };
}) => {
  await kv.set([field, id], value);
};

export const delKv = async ({
  field,
  id,
}: {
  field: "pollMessageId";
  id: number;
}) => {
  await kv.delete([field, id]);
};

export const getKv = async ({
  field,
  id,
}: {
  field: "pollMessageId";
  id: number;
}) => {
  return await kv.get<{ count: number; votes: number[] }>([field, id]);
};
