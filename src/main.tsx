import React from "react";
import ReactDOM from "react-dom/client";

type ClientDetails = {
  name: string;
  tagline?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
};

function getClientId(): string | null {
  const params = new URLSearchParams(window.location.search);
  const queryClient = params.get("client");
  if (queryClient) return queryClient;

  const pathMatch = window.location.pathname.match(/\/client=([^/]+)/);
  return pathMatch ? decodeURIComponent(pathMatch[1]) : null;
}

async function getClientDetails(clientId: string): Promise<ClientDetails | null> {
  const response = await fetch("/clients.json");
  if (!response.ok) {
    throw new Error("Failed to load clients.json");
  }

  const clients = (await response.json()) as Record<string, ClientDetails>;
  return clients[clientId] ?? null;
}

function App() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [clientId, setClientId] = React.useState<string | null>(null);
  const [client, setClient] = React.useState<ClientDetails | null>(null);

  React.useEffect(() => {
    const id = getClientId();
    setClientId(id);

    if (!id) {
      setError("Pass a client id like ?client=rabbit_and_turtle_studios");
      setLoading(false);
      return;
    }

    getClientDetails(id)
      .then((details) => {
        if (!details) {
          setError(`No client found for "${id}"`);
          setLoading(false);
          return;
        }

        setClient(details);
        document.title = `${details.name} - ${details.tagline ?? "Website"}`;
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });
  }, []);

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "#0d0d0d",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
    padding: "32px",
  };

  if (loading) {
    return <div style={containerStyle}>Loading client details...</div>;
  }

  if (error || !client) {
    return (
      <div style={containerStyle}>
        <h1>Client Website Loader</h1>
        <p>{error ?? "Unknown issue"}</p>
        <p>Current client id: {clientId ?? "(none)"}</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1>{client.name}</h1>
      {client.tagline && <p>{client.tagline}</p>}
      {client.description && <p>{client.description}</p>}
      {client.phone && <p>Phone: {client.phone}</p>}
      {client.email && <p>Email: {client.email}</p>}
      {client.address && <p>Address: {client.address}</p>}
      <p>Client key: {clientId}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
