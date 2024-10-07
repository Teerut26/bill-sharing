import { type AppType } from "next/app";
import { Notifications } from "@mantine/notifications";
import "@/styles/globals.css";
import { createTheme, MantineProvider } from "@mantine/core";
import { nprogress, NavigationProgress } from "@mantine/nprogress";
import AppLayout from "@/layouts/AppLayout";
import { SessionProvider } from "next-auth/react";
import router from "next/router";
import { useEffect } from "react";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import { api } from "@/utils/api";

const themeMantine = createTheme({
  fontFamily: "Anuphan",
  radius: {
    sm: "0.4rem",
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    const handleRouteStart = () => nprogress.start();
    const handleRouteDone = () => nprogress.complete();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);

  return (
    <SessionProvider>
      <MantineProvider theme={themeMantine}>
        <NavigationProgress />
        <Notifications position="top-right" />
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
