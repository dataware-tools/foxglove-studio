import { useEffect } from "react";
import { useServerAnnotations } from "../apiClients";

export const ServerAnnotationSync = () => {
  const { syncLocalAnnotationsToFetched, fetchedAnnotations } =
    useServerAnnotations();
  // TODO(WatanabeToshimitsu): Sync local annotations to server periodically
  // NOTE(yusukefs): The refreshInterval option of SWR may be useful
  // https://swr.vercel.app/docs/revalidation#revalidate-on-interval
  useEffect(() => {
    syncLocalAnnotationsToFetched();
  }, [fetchedAnnotations, syncLocalAnnotationsToFetched]);
  return <span />;
};
