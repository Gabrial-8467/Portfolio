export function mapId(record) {
  if (!record || typeof record !== 'object') return record;
  const { _id, ...rest } = record;
  return { id: _id, ...rest };
}

export const mapList = (list) => (Array.isArray(list) ? list.map(mapId) : []);