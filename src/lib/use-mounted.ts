import { useEffect, useState } from "react";

/** False on SSR and the first client paint, true after mount. Avoids auth hydration mismatches. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
