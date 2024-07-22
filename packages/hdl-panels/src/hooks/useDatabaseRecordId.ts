export const useDatabaseRecordId = () => {
  const queryStrings = new URLSearchParams(window.location.search);
  const databaseId = queryStrings.get("database-id") ?? "unknownDatabase";
  const recordId = queryStrings.get("record-id") ?? "unknownDatabase";

  return { databaseId, recordId };
};
