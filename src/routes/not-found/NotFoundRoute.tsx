import { Button } from "../../shared/ui/Button";
import { Card } from "../../shared/ui/Card";

export function NotFoundRoute() {
  return (
    <main className="common-page-shell">
      <Card>
        <p className="common-eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The requested screen has not been added yet.</p>
        <Button as="a" href="/">Return home</Button>
      </Card>
    </main>
  );
}
