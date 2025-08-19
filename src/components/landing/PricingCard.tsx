"use client";

const plans = [
  {
    _id: 1,
    name: "Free Account",
    price: 0,
    description:
      "Perfect for users who only want to request gigs without providing services.",
    benefits: [
      "Can only be a user (request gigs)",
      "No provider profile",
      "No posting as a provider",
    ],
  },
  {
    _id: 2,
    name: "Basic Account",
    price: 16,
    description:
      "Limited access to pro features — for users who want to start providing services with restrictions.",
    benefits: [
      "Can post as user or provider",
      "Limited access to pro account features",
      "Unable to earn badges like 'Top Rated Seller'",
      "Max 3 gig postings per month",
      "Max 5 bids per month",
    ],
  },
  {
    _id: 3,
    name: "Pro Account",
    price: 20,
    description:
      "Full access for both requesting and providing gigs with one account.",
    benefits: [
      "Can be both user and provider",
      "User and provider profile under the same account",
      "Unlimited gig postings",
      "Unlimited bids",
      "Access to all badges and pro features",
    ],
  },
];

export default function PricingCard() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Membership Plans
        </h2>
        <p className="text-gray-500 text-center max-w-xl mx-auto mb-12">
          Flexible plans to match your freelancing journey and help you grow.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="flex flex-col justify-between border border-gray-200 rounded-2xl p-6 text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div>
                <h3 className="text-3xl font-bold mb-1">${plan.price}</h3>
                <h4 className="text-xl font-semibold mb-2">{plan.name}</h4>
                <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

                <ul className="space-y-2 mb-6 text-left">
                  {plan.benefits.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-gray-700 text-sm"
                    >
                     ✅{feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[#5bbb7b] bg-[#eef8f2] hover:text-white hover:bg-[#5bbb7b] rounded-full transition-all duration-300 font-semibold"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
