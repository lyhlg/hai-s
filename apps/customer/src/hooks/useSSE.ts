import { useEffect, useRef, useCallback } from "react";

export function useSSE(url: string, onMessage: (event: any) => void) {
  const esRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fullUrl = `${url}${url.includes("?") ? "&" : "?"}token=${token}`;
    const es = new EventSource(fullUrl);

    es.onmessage = (e) => {
      try {
        onMessage(JSON.parse(e.data));
      } catch { /* ignore parse errors */ }
    };

    es.onerror = () => {
      es.close();
      setTimeout(connect, 3000);
    };

    esRef.current = es;
  }, [url, onMessage]);

  useEffect(() => {
    connect();
    return () => { esRef.current?.close(); };
  }, [connect]);
}
