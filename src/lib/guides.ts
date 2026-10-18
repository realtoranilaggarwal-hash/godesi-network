export type Guide = {
  slug: string;
  icon: string;
  title: string;
  /** One line for cards and the meta description. */
  summary: string;
  audience: "buy" | "sell" | "both";
  sections: { heading: string; body: string[] }[];
  faq: { q: string; a: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "agent-vs-fsbo",
    icon: "⚖️",
    title: "Selling with an agent vs. selling it yourself (FSBO)",
    summary:
      "What you actually do yourself when you skip the agent, what it can save, and where sellers most often lose money.",
    audience: "sell",
    sections: [
      {
        heading: "What an agent does for a seller",
        body: [
          "A listing agent prices the home from recent nearby sales, prepares it for photos and showings, lists it on the MLS so other agents and the big home-search websites pick it up, and arranges and screens showings.",
          "Once offers arrive, the agent compares them on more than price — financing, inspection and appraisal terms, closing date — negotiates repairs after the inspection, and keeps the deal moving to closing.",
        ],
      },
      {
        heading: "What you take on when you sell it yourself",
        body: [
          "You set the price, write the listing, take or pay for photos, handle every call and showing, and negotiate directly with the buyer and often with the buyer's agent.",
          "You also manage the paperwork and deadlines: the seller disclosure forms your state requires, the contract, inspection and appraisal dates, and working with the title company or attorney.",
        ],
      },
      {
        heading: "Where the money is won or lost",
        body: [
          "The commission you save only helps if the home still sells for a similar price, in a similar time, without a deal falling apart. Over-pricing that leaves a home sitting, or accepting a weak offer that collapses, can cost more than the fee.",
          "Commissions are negotiable. If cost is the worry, compare a few agents and ask what each would charge and what is included before deciding to go it alone.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I list on the MLS without an agent?",
        a: "Many areas have flat-fee services that place your home on the MLS for a set price while you handle the rest. What's included varies, so read the terms.",
      },
      {
        q: "Will I still deal with an agent if I sell it myself?",
        a: "Often yes — many buyers have their own agent, and you will need to agree whether and how that agent is paid.",
      },
    ],
  },
  {
    slug: "who-pays-the-agent",
    icon: "💵",
    title: "Who pays the real estate agent now?",
    summary:
      "Since August 2024, buyers sign an agreement with their agent and commissions are agreed in writing. Here is what that means for you.",
    audience: "both",
    sections: [
      {
        heading: "What changed in 2024",
        body: [
          "After a national settlement involving the National Association of REALTORS®, two rules took effect in August 2024 for agents who belong to NAR-affiliated MLSs. Offers to pay the buyer's agent can no longer be posted on the MLS, and agents working with a buyer must have a written agreement with that buyer before touring a home.",
          "Commissions were always negotiable, and they still are. Nothing sets a standard percentage.",
        ],
      },
      {
        heading: "If you are buying",
        body: [
          "Your buyer agreement says what your agent will be paid and how. The seller may still agree to cover some or all of it — your agent can ask for that in your offer — and whatever the seller doesn't cover is up to you.",
          "Read the agreement before you sign it: how long it lasts, which homes or areas it covers, the amount, and how you can end it.",
        ],
      },
      {
        heading: "If you are selling",
        body: [
          "Your listing agreement sets your own agent's pay. You can also decide whether you are willing to contribute toward a buyer's agent, and you can respond to that request offer by offer.",
        ],
      },
    ],
    faq: [
      {
        q: "Is there a standard commission?",
        a: "No. Fees are set by agreement between you and the agent and vary by market, home and services.",
      },
      {
        q: "Do I need to sign before an open house?",
        a: "Generally you can walk into a public open house on your own. The written agreement applies when an agent works with you to tour homes.",
      },
    ],
  },
  {
    slug: "first-time-buyer-steps",
    icon: "🗝️",
    title: "First-time home buyer: the steps from savings to keys",
    summary:
      "The order things happen in, from checking your budget to closing day, and where an agent helps along the way.",
    audience: "buy",
    sections: [
      {
        heading: "1. Know your budget",
        body: [
          "Check your credit, add up your savings for the down payment and closing costs, and talk to a lender or two to get pre-approved. A pre-approval letter tells sellers you can actually buy.",
          "Ask your lender about first-time buyer programs — many states and cities offer down-payment help.",
        ],
      },
      {
        heading: "2. Pick an agent and your must-haves",
        body: [
          "Interview two or three local agents, agree on terms in writing, and give them your list: area, schools, commute, size, and the things you will and won't compromise on.",
        ],
      },
      {
        heading: "3. Tour, offer, inspect",
        body: [
          "Your agent sets up tours, pulls recent sales to judge a fair price, and writes your offer with the right contingencies — usually financing, appraisal and inspection.",
          "After the inspection your agent negotiates repairs or a credit with the seller.",
        ],
      },
      {
        heading: "4. Close",
        body: [
          "The lender orders the appraisal and finalises the loan, the title company or attorney checks the title, and you do a final walk-through before signing and getting the keys.",
        ],
      },
    ],
    faq: [
      {
        q: "How much do I need for a down payment?",
        a: "It depends on the loan. Some programs allow very low down payments; your lender can show you the options you qualify for.",
      },
      {
        q: "How long does buying take?",
        a: "After an accepted offer, closing commonly takes about 30 to 45 days, depending on the loan and the contract.",
      },
    ],
  },
  {
    slug: "what-a-buyers-agent-does",
    icon: "🤝",
    title: "What a buyer's agent actually does for you",
    summary:
      "From finding homes before they hit the big websites to negotiating repairs: the work behind a buyer's agent's fee.",
    audience: "buy",
    sections: [
      {
        heading: "Before you find the home",
        body: [
          "A buyer's agent sets up searches on the MLS, often hears about homes coming soon, books tours, and points out what photos don't show — noise, layout, condition, flood zones.",
        ],
      },
      {
        heading: "When you make an offer",
        body: [
          "They pull comparable sales so you don't overpay, advise on contingencies and deposit, and present your offer in the way that gives it the best chance in a competitive market.",
        ],
      },
      {
        heading: "Between offer and closing",
        body: [
          "They track deadlines, attend or arrange the inspection, negotiate repairs or credits, coordinate with the lender, title company or attorney, and handle surprises such as a low appraisal.",
        ],
      },
    ],
    faq: [
      {
        q: "Can the seller's agent represent me too?",
        a: "Some states allow one agent or brokerage to work with both sides with written consent, but that agent cannot fully advocate for either side. Ask how they handle it.",
      },
    ],
  },
  {
    slug: "questions-to-ask-an-agent",
    icon: "📝",
    title: "15 questions to ask before you hire an agent",
    summary:
      "A short interview list for buyers and sellers, so you can compare agents on facts rather than first impressions.",
    audience: "both",
    sections: [
      {
        heading: "Experience",
        body: [
          "Are you licensed in this state, and for how long? Is this your full-time job? How many clients like me did you help last year? Which neighbourhoods do you know best? Can I speak to two recent clients?",
        ],
      },
      {
        heading: "How you work",
        body: [
          "Who will I deal with day to day — you or a team? How fast do you usually reply? How will you keep me updated? Which languages do you speak?",
        ],
      },
      {
        heading: "Money and paperwork",
        body: [
          "What do you charge, and what exactly is included? How long is the agreement, and how can I end it if it isn't working? For sellers: how would you price and market my home? For buyers: how do you find homes before they're widely advertised?",
        ],
      },
    ],
    faq: [
      {
        q: "How many agents should I interview?",
        a: "Two or three is usually enough to compare experience, approach and fees.",
      },
      {
        q: "How do I check an agent's licence?",
        a: "Every state's real estate commission has a free online licence lookup.",
      },
    ],
  },
  {
    slug: "pricing-your-home",
    icon: "🏷️",
    title: "How to price your home to sell",
    summary:
      "Why recent nearby sales matter more than online estimates, and what over-pricing really costs.",
    audience: "sell",
    sections: [
      {
        heading: "Start from comparable sales",
        body: [
          "Buyers and appraisers judge your price against similar homes that sold recently nearby. An agent pulls these 'comps' from the MLS and adjusts for size, condition, lot and updates.",
          "Online estimates are a starting point, but they can't see inside your home.",
        ],
      },
      {
        heading: "Why over-pricing backfires",
        body: [
          "Most buyer interest comes in the first couple of weeks. A home priced too high gets fewer showings, sits, and often sells after price cuts for less than a well-priced home would have.",
          "Even with a willing buyer, the lender's appraisal may come in lower than the price and force a renegotiation.",
        ],
      },
    ],
    faq: [
      {
        q: "Should I get a pre-listing appraisal?",
        a: "It can help for unusual homes. For most homes, a careful comparative market analysis from a local agent is enough.",
      },
    ],
  },
  {
    slug: "getting-your-home-ready",
    icon: "🧹",
    title: "Getting your home ready to sell",
    summary:
      "Low-cost fixes, cleaning and staging that make a difference in photos and showings, and what to skip.",
    audience: "sell",
    sections: [
      {
        heading: "Do first",
        body: [
          "Declutter and deep-clean, fix small things that are obviously broken, freshen up paint where it's tired, and make the entrance welcoming. Good light and good photos matter because the first showing happens online.",
        ],
      },
      {
        heading: "Think twice",
        body: [
          "Big renovations right before selling rarely pay back their full cost. Ask an agent which updates buyers in your area actually pay more for.",
        ],
      },
      {
        heading: "Consider a pre-listing inspection",
        body: [
          "Finding problems early lets you fix them or price them in, instead of being surprised after you've accepted an offer.",
        ],
      },
    ],
    faq: [
      {
        q: "Is professional staging worth it?",
        a: "It depends on the home and price range. Many agents can advise on simple staging using your own furniture.",
      },
    ],
  },
  {
    slug: "buyer-agreements",
    icon: "✍️",
    title: "Buyer agreements: what you are signing",
    summary:
      "Most agents now ask buyers to sign a written agreement before touring homes. The parts to read carefully.",
    audience: "buy",
    sections: [
      {
        heading: "What it covers",
        body: [
          "A buyer agreement sets out what your agent will do, how and how much they'll be paid, how long the agreement lasts, and the homes or area it covers.",
        ],
      },
      {
        heading: "Read these parts",
        body: [
          "The amount or rate and who pays it. Whether the seller paying part of it reduces what you owe. The end date and how you can cancel. Whether it's exclusive, and whether it covers a home you find yourself.",
          "You can ask for changes, such as a shorter term or a single home to start.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I tour one home before committing?",
        a: "Many agents offer a short or single-property agreement for a first tour. Ask.",
      },
    ],
  },
  {
    slug: "buying-in-a-competitive-market",
    icon: "🏁",
    title: "How to win a home in a competitive market",
    summary:
      "Practical ways to make your offer stand out without overpaying or taking on risks you don't understand.",
    audience: "buy",
    sections: [
      {
        heading: "Be ready before you see it",
        body: [
          "Have a fresh pre-approval, your deposit funds in place and your agent's comps ready, so you can offer the same day.",
        ],
      },
      {
        heading: "Strengthen terms, not only price",
        body: [
          "A larger deposit, a flexible closing date, a shorter inspection window or an appraisal-gap plan can matter as much as the number. Your agent can learn what this seller cares about.",
          "Waiving inspection or appraisal protections can be expensive if something goes wrong. Understand the risk before you do it.",
        ],
      },
    ],
    faq: [
      {
        q: "What is an escalation clause?",
        a: "A term that raises your offer by a set amount above competing offers, up to a cap you choose. Not every seller accepts them.",
      },
    ],
  },
  {
    slug: "realtor-vs-agent",
    icon: "🔤",
    title: "REALTOR® vs. real estate agent: what's the difference?",
    summary:
      "Every REALTOR® is a licensed agent or broker, but not every agent is a REALTOR®. What the word means.",
    audience: "both",
    sections: [
      {
        heading: "Licensed agent or broker",
        body: [
          "Anyone who helps you buy or sell for pay must hold a real estate licence from the state. A broker has extra training and can run a brokerage; agents work under a broker.",
        ],
      },
      {
        heading: "REALTOR®",
        body: [
          "REALTOR® is a registered membership mark. It may only be used by licensed agents and brokers who belong to the National Association of REALTORS® and agree to follow its Code of Ethics.",
          "Many excellent agents are REALTORS®, and some are not. Experience, local knowledge and how well they listen matter most — so compare a few.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I know if an agent is a REALTOR®?",
        a: "Ask them, or search the National Association of REALTORS® member directory.",
      },
    ],
  },
];

export function guideBySlug(slug: string) {
  return GUIDES.find((guide) => guide.slug === slug) ?? null;
}
