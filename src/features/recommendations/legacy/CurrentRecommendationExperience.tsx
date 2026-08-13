import CurrentPage from "../../../../app/page";

/**
 * Compatibility boundary for the product that already exists.
 * Its data, API calls and recommendation logic deliberately remain untouched.
 * New implementations can replace this component behind HomeRoute later.
 */
export function CurrentRecommendationExperience() {
  return <CurrentPage />;
}
