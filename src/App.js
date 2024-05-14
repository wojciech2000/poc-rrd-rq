import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

// pages
import Home from "./pages/Home";
import About from "./pages/About";
import Faq from "./pages/help/Faq";
import Contact, { contactAction } from "./pages/help/Contact";
import NotFound from "./pages/NotFound";
import Careers, { careersLoader } from "./pages/careers/Careers";
import CareerDetails, { careerDetailsLoader } from "./pages/careers/CareerDetails";
import CareersError from "./pages/careers/CareersError";

// layouts
import RootLayout from "./layouts/RootLayout";
import HelpLayout from "./layouts/HelpLayout";
import { lazy, Suspense } from "react";

const CareersLayout = lazy(() => import("./layouts/CareersLayout"));

const getRouter = queryClient =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="help" element={<HelpLayout />}>
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact />} action={contactAction} />
        </Route>
        <Route path="careers" element={<CareersLayout />} errorElement={<CareersError />}>
          <Route
            index
            element={<Careers />}
            loader={() => careersLoader(queryClient)}
            // errorElement={<CareersError />}
          />
          <Route path=":id" element={<CareerDetails />} loader={careerDetailsLoader} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>,
    ),
  );

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>LAZY COMPONENTS LOADING</div>}>
        <RouterProvider router={getRouter(queryClient)} />
      </Suspense>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
