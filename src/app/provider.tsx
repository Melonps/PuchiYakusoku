"use client";

import { UIProvider } from "@yamada-ui/react";
import { GlobalContext } from "@/contexts/GlobalContext";
import { Liff } from "@line/liff";
import { useEffect, useState } from "react";
import { theme } from "@/app/theme";

export default function LIFFTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(() => {
            console.log("LIFF init succeeded.");
            setLiffObject(liff);
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.");
            setLiffError(error.toString());
          });
      });
  }, []);

  return (
    <UIProvider theme={theme}>
      <GlobalContext.Provider
        value={{ liff: liffObject, liffError: liffError }}
      >
        <div>{children}</div>
      </GlobalContext.Provider>
    </UIProvider>
  );
}
