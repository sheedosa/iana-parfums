import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { useStage } from "../lib/stage";

export function NotFound() {
  useStage(null);
  return (
    <section className="wrap flex flex-col items-start gap-3 pt-10">
      <Seo title="Page not found" path="/404" description="That page isn't here." noindex />
      <h1>That page isn't here</h1>
      <p className="t-lede measure">It may have moved. The four scents are on the shelf below.</p>
      <p className="flex flex-wrap gap-x-8"><Link to="/range" className="act">See the range</Link><Link to="/" className="link">Home</Link></p>
    </section>
  );
}
