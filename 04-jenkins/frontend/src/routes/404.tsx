import { Link } from "@tanstack/react-router";
import Heading from "@/components/heading";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="space-y-4 text-center">
        <Heading as="h1" className="text-6xl text-charcoal">
          404
        </Heading>
        <p className="font-body text-xl text-charcoal/60">Page not found</p>
        <p className="font-body text-charcoal/50">Sorry, we couldn't find the recipe you're looking for.</p>
        <Link to="/" className="btn-primary mt-6 inline-block">
          Back to Recipes
        </Link>
      </div>
    </div>
  );
}
