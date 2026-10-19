"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  sendAgentRequest,
  type AgentRequestState,
} from "@/app/actions/agentRequest";

type Mode = "buy" | "sell";

function Submit({ className }: { className: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className={className}>
      {pending ? "Sending…" : "Compare agents"}
    </button>
  );
}

/**
 * Compare agents request, filled in and sent from this site. GoDesi passes it
 * to matching local agents only because the visitor ticks the consent box.
 */
export function AgentRequestForm({
  mode,
  choose = false,
  dark = false,
}: {
  /** Fixed buy/sell, or the default when `choose` shows a picker. */
  mode: Mode;
  choose?: boolean;
  dark?: boolean;
}) {
  const [state, action] = useFormState<AgentRequestState, FormData>(
    sendAgentRequest,
    {},
  );
  const input = `w-full rounded-lg px-3 py-2 text-sm text-slate-900 ${
    dark ? "" : "border border-slate-300"
  }`;

  if (state.ok) {
    return (
      <p
        role="status"
        className={`rounded-lg p-3 text-sm font-semibold ${
          dark ? "bg-white/15" : "bg-white text-emerald-800 ring-1 ring-emerald-200"
        }`}
      >
        ✅ Thanks! Your request is in. Up to 3 matching local agents will
        contact you soon.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-2">
      {choose ? (
        <select
          name="do"
          defaultValue={mode}
          aria-label="Buying or selling"
          className={`${input} bg-white`}
        >
          <option value="buy">I&apos;m buying</option>
          <option value="sell">I&apos;m selling</option>
        </select>
      ) : (
        <input type="hidden" name="do" value={mode} />
      )}
      <input
        name="city"
        required
        maxLength={80}
        placeholder="City or ZIP"
        aria-label="City or ZIP"
        className={input}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          name="name"
          required
          maxLength={80}
          placeholder="Your name"
          aria-label="Your name"
          autoComplete="name"
          className={input}
        />
        <input
          name="phone"
          required
          type="tel"
          maxLength={30}
          placeholder="Phone"
          aria-label="Phone"
          autoComplete="tel"
          className={input}
        />
      </div>
      <input
        name="email"
        type="email"
        maxLength={120}
        placeholder="Email (optional)"
        aria-label="Email (optional)"
        autoComplete="email"
        className={input}
      />
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <label className="flex items-start gap-2 text-[11px] leading-snug">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-3.5 w-3.5 shrink-0"
        />
        <span className={dark ? "text-white/90" : "text-slate-600"}>
          Free, no obligation. I agree that GoDesi may pass my request to up to
          3 matching local agents, who may call or email me. My details are
          never sold or shown publicly.
        </span>
      </label>
      {state.error ? (
        <p
          role="alert"
          className={`text-xs font-semibold ${dark ? "text-amber-200" : "text-red-700"}`}
        >
          {state.error}
        </p>
      ) : null}
      <Submit
        className={`w-full rounded-lg px-3 py-2 text-sm font-bold disabled:opacity-60 ${
          dark
            ? "bg-amber-400 text-slate-900 hover:bg-amber-300"
            : "bg-teal-600 text-white hover:bg-teal-700"
        }`}
      />
    </form>
  );
}
