import { createTransaction, DonationError, type DonationInput } from "@/lib/chango";
import { site } from "@/lib/site";

function parse(raw: unknown): DonationInput | string {
  if (!raw || typeof raw !== "object") return "Invalid request.";
  const b = raw as Record<string, unknown>;
  const amount = Number(b.amount);
  const fullName = typeof b.fullName === "string" ? b.fullName.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const msisdn = typeof b.msisdn === "string" ? b.msisdn.replace(/\D/g, "") : "";

  if (!Number.isFinite(amount) || amount < 1 || amount > 100_000) return "Enter an amount between GH₵1 and GH₵100,000.";
  if (!fullName || fullName.length > 100) return "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) return "Enter a valid email address.";
  if (!/^233\d{9}$/.test(msisdn)) return "Enter a valid Ghana phone number.";
  if (b.paymentMethod !== "mobile_money" && b.paymentMethod !== "card") return "Choose a payment method.";

  return {
    amount: Math.round(amount * 100) / 100,
    fullName,
    email,
    msisdn,
    paymentMethod: b.paymentMethod,
    anonymous: b.anonymous === true,
  };
}

export async function POST(request: Request) {
  const input = parse(await request.json().catch(() => null));
  if (typeof input === "string") return Response.json({ error: input }, { status: 400 });

  try {
    const checkoutUrl = await createTransaction(input, {
      origin: request.headers.get("origin") ?? new URL(request.url).origin,
      pageTitle: `In memory of ${site.name}`,
      narration: `Donation in memory of ${site.name}`,
    });
    return Response.json({ checkoutUrl });
  } catch (error) {
    if (error instanceof DonationError) return Response.json({ error: error.message }, { status: error.status });
    console.error(error);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
