import { Auth0Provider } from "@auth0/auth0-react";
import { ReactNode } from "react";

export const ConfiguredAuth0Provider = ({ children }: { children: ReactNode }) => (
  <Auth0Provider
    clientId={process.env.DATAWARE_TOOLS_AUTH_CONFIG_CLIENT_ID ?? "unknownClientId"}
    domain={process.env.DATAWARE_TOOLS_AUTH_CONFIG_DOMAIN ?? "unknownDomain"}
    audience={process.env.DATAWARE_TOOLS_AUTH_CONFIG_API_URL ?? "unknownAudience"}
    redirectUri={typeof window === "undefined" ? undefined : `${window.location.origin}/callback`}
  >
    {children}
  </Auth0Provider>
);
