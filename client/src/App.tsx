import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SavedNames from "@/pages/saved-names";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/saved" component={SavedNames} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
