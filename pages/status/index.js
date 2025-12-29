import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  return await response.json();
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
      <DataBaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let updatedAtText = "Loading...";
  if (!isLoading && data)
    updatedAtText = new Date(data.update_at).toLocaleString("pt-BR");

  return <div>Last updated at: {updatedAtText}</div>;
}

function DataBaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let dbStatusInformation = "Loading...";
  if (!isLoading && data)
    dbStatusInformation = (
      <>
        <div>Version: {data.dependencies.database.version}</div>
        <div>
          Open Connections: {data.dependencies.database.opened_connections}
        </div>
        <div>Max Connections: {data.dependencies.database.max_connections}</div>
      </>
    );

  return (
    <>
      <h2>Database Status</h2>
      <div>{dbStatusInformation}</div>
    </>
  );
}
