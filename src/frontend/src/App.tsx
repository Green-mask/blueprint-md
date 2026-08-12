import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const MeasurePage = lazy(() => import("@/pages/Measure"));
const PlotsPage = lazy(() => import("@/pages/Plots"));

function PageLoader() {
  return (
    <div className="flex-1 p-4 space-y-3">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/measure" });
  },
});

const measureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/measure",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <MeasurePage />
    </Suspense>
  ),
});

const plotsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/plots",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <PlotsPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([indexRoute, measureRoute, plotsRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
