import type { Property } from "@/lib/realEstate";
import { formatPrice } from "@/lib/realEstate";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <a
      href={property.godesiUrl}
      target="_blank"
      rel="noopener"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      {property.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={property.images[0]}
          alt=""
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-sky-50 text-5xl">
          🏠
        </div>
      )}
      <div className="p-3">
        <p className="text-xs font-bold uppercase text-sky-700">
          For {property.kind}
        </p>
        <p className="line-clamp-1 font-bold">{property.title}</p>
        <p className="text-sm font-semibold text-emerald-700">
          {formatPrice(property)}
        </p>
        <p className="text-xs text-slate-500">
          {[property.area, property.city].filter(Boolean).join(", ")}
          {property.bedrooms ? ` · ${property.bedrooms} bed` : ""}
          {property.bathrooms ? ` · ${property.bathrooms} bath` : ""}
        </p>
      </div>
    </a>
  );
}
