import { AppProviders } from "../../components/app/AppProviders";
import { AppRouter } from "./router/AppRouter";

export function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
