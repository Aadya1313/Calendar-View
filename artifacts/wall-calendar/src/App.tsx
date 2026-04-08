import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Calendar from "@/pages/Calendar";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Calendar />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
