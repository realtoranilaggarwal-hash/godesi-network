import type { Metadata } from "next";
import { headers } from "next/headers";
import { PropertyCard } from "@/components/realestate/PropertyCard";
import { fetchProperties } from "@/lib/realEstate";
import { godesiUrl, realEstateSiteForHost } from "@/lib/sites";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Homes for sale and rent",
  alternates: { canonical: "/properties" },
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { kind?: string };
}) {
  realEstateSiteForHost(headers().get("host"));
  const kind =
    searchParams.kind === "sale" || searchParams.kind === "rent"
      ? searchParams.kind
      : undefined;
  const { items } = await fetchProperties({
    limit: "60",
    ...(kind ? { kind } : {}),
  });

  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <h1 className="text-2xl font-black">Homes for sale and rent</h1>
      <nav className="flex gap-2 text-sm font-semibold">
        {[
          { href: "/properties", label: "All", active: !kind },
          {
            href: "/properties?kind=sale",
            label: "For sale",
            active: kind === "sale",
          },
          {
            href: "/properties?kind=rent",
            label: "For rent",
            active: kind === "rent",
          },
        ].map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-3 py-1 ${
              tab.active
                ? "bg-indigo-600 text-white"
                : "border border-slate-300 bg-white"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </nav>
      {items.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((property) => (
            <PropertyCard key={property.slug} property={property} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">No properties posted yet.</p>
      )}
      <p className="text-sm text-slate-600">
        Properties are posted by members on GoDesi.{" "}
        <a
          href={godesiUrl("/listings/new?kind=PROPERTY_SALE")}
          className="font-semibold text-indigo-600"
        >
          Post yours free →
        </a>
      </p>
    </main>
  );
}
