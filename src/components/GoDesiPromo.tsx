const GODESI_URL = "https://godesi.com";

const POINTS = [
  "List and promote your business",
  "Reach more local customers",
  "Promote events and celebrations",
  "Share news, stories, and achievements",
  "Get discovered through our growing network of websites",
];

export function GoDesiPromo({ source, signature = true }: { source: string; signature?: boolean }) {
  const ref = `?ref=${encodeURIComponent(source)}`;
  return (
    <section aria-labelledby="godesi-promo-heading" className="px-4 py-12">
      <div className="mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-blue-50 p-6 text-slate-800 shadow-sm md:grid-cols-2 md:p-10">
        <a href={`${GODESI_URL}/${ref}`} className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/godesi-join.webp"
            alt="Join GoDesi.com — list your business, promote your events, share your news and be part of a growing Desi community"
            width={1000}
            height={1000}
            loading="lazy"
            className="h-auto w-full rounded-2xl shadow-md"
          />
        </a>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            One Community. Endless Opportunities.
          </p>
          <h2 id="godesi-promo-heading" className="mt-2 text-3xl font-extrabold leading-tight text-blue-950 md:text-4xl">
            Welcome to{" "}
            <a href={`${GODESI_URL}/${ref}`} className="text-orange-600 hover:underline">
              GoDesi.com
            </a>
            !
          </h2>
          <p className="mt-4 text-lg text-slate-700">
            Looking to promote your business, discover local Desi businesses, share events, or spread your news?
            GoDesi.com brings our Desi community together!
          </p>
          <ul className="mt-5 space-y-2">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2 text-slate-800">
                <span aria-hidden="true" className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                  ✓
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-slate-700">
            Whether you&apos;re a business owner, professional, community organizer, or simply want to stay connected
            — GoDesi.com is <strong>YOUR</strong> platform! Let&apos;s support our own businesses and grow together. 🙏
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`${GODESI_URL}/signup${ref}`}
              className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white shadow hover:bg-orange-700"
            >
              Register free
            </a>
            <a
              href={`${GODESI_URL}/add-business${ref}`}
              className="rounded-full bg-blue-900 px-6 py-3 font-semibold text-white shadow hover:bg-blue-950"
            >
              List your business
            </a>
            <a
              href={`${GODESI_URL}/${ref}`}
              className="rounded-full border border-blue-900 px-6 py-3 font-semibold text-blue-900 hover:bg-blue-50"
            >
              Visit GoDesi.com
            </a>
          </div>
          {signature ? <p className="mt-5 text-sm font-semibold text-slate-600">— Anil | GoDesi.com</p> : null}
        </div>
      </div>
    </section>
  );
}
