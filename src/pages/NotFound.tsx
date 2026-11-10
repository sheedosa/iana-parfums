import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { Bottle } from "../components/Art";
import { fullName, store } from "../lib/store";

export function NotFound() {
  return (
    <section className="wrap grid items-end gap-x-14 gap-y-10 pb-6 pt-14 sm:pt-20 lg:grid-cols-[1fr_1.1fr]">
      <Seo title="Page not found" path="/404" description="That page isn't here." noindex />
      <div className="flex flex-col items-start gap-4">
        <h1>That page isn't here.</h1>
        <p className="t-lede measure">It may have moved. The four scents are still on the shelf.</p>
        <div className="flex flex-wrap gap-3 pt-2"><Link to="/range" className="btn btn-ink">See the range</Link><Link to="/" className="btn btn-ghost">Home</Link></div>
      </div>
      <ul className="flex h-[clamp(150px,22vw,260px)] items-end border-b border-ink">
        {store.scents().map((s) => (
          <li key={s.handle} className="flex h-full min-w-0 flex-1"><Link to={`/scents/${s.handle}`} className="shelf-btn h-full" data-step="rest"><Bottle scent={s} /><span className="sr-only">{fullName(s)}</span></Link></li>
        ))}
      </ul>
    </section>
  );
}
