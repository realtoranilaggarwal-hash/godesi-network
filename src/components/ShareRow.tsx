const BUTTON =
  "rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50";

/**
 * Share links for a teaser. Pinterest first: these cards carry a picture, and a
 * pin keeps sending readers back to the Godesi record long after the post.
 */
export function ShareRow({
  url,
  title,
  image,
}: {
  url: string;
  title: string;
  image?: string | null;
}) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {image ? (
        <a
          href={`https://pinterest.com/pin/create/button/?url=${u}&media=${encodeURIComponent(
            image,
          )}&description=${t}`}
          target="_blank"
          rel="noopener nofollow"
          className={BUTTON}
        >
          📌 Pin
        </a>
      ) : null}
      <a
        href={`https://api.whatsapp.com/send?text=${t}%20${u}`}
        target="_blank"
        rel="noopener nofollow"
        className={BUTTON}
      >
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
        target="_blank"
        rel="noopener nofollow"
        className={BUTTON}
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`}
        target="_blank"
        rel="noopener nofollow"
        className={BUTTON}
      >
        X
      </a>
    </div>
  );
}
