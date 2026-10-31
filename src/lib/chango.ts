// Chango third-party API (Create Transaction). Credentials are server-only env vars.
// Required: CHANGO_CREATE_TRANSACTION_URL, CHANGO_X_API_KEY (sent as the x-api-key
// header), CHANGO_API_KEY (api-key header), CHANGO_TRANSFLOW_ID (transflow-id header),
// CHANGO_GROUP_ID, CHANGO_CAMPAIGN_ID, CHANGO_PAYMENT_DESTINATION_NUMBER.
// The campaign ID is also sent as merchantProductId.

export type DonationInput = {
  amount: number;
  fullName: string;
  email: string;
  /** International format without "+", e.g. 233201234567. */
  msisdn: string;
  paymentMethod: "mobile_money" | "card";
  anonymous: boolean;
};

function config() {
  const env = process.env;
  const c = {
    destinationCode: env.DESTINATION_CODE?.trim(),
    url: env.CHANGO_CREATE_TRANSACTION_URL?.trim(),
    gatewayKey: env.CHANGO_X_API_KEY?.trim(),
    apiKey: env.CHANGO_API_KEY?.trim(),
    transflowId: env.CHANGO_TRANSFLOW_ID?.trim(),
    groupId: env.CHANGO_GROUP_ID?.trim(),
    campaignId: env.CHANGO_CAMPAIGN_ID?.trim(),
    destination: env.CHANGO_PAYMENT_DESTINATION_NUMBER?.trim(),
    merchantProductId: env.CHANGO_CAMPAIGN_ID?.trim(),
  };
  const missing = Object.entries(c)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  return { c, missing };
}

// The checkout link isn't named in the docs we have, so take the first URL in the
// response, preferring keys that look like one.
function findCheckoutUrl(value: unknown): string | undefined {
  const urls: { key: string; url: string }[] = [];
  (function walk(node: unknown, key: string) {
    if (typeof node === "string" && /^https?:\/\//.test(node))
      urls.push({ key, url: node });
    else if (node && typeof node === "object")
      for (const [k, v] of Object.entries(node)) walk(v, k);
  })(value, "");
  return (
    urls.find((u) => /url|link|redirect|checkout/i.test(u.key)) ?? urls[0]
  )?.url;
}

export class DonationError extends Error {
  constructor(
    message: string,
    readonly status = 502,
  ) {
    super(message);
  }
}

export async function createTransaction(
  input: DonationInput,
  opts: { origin: string; pageTitle: string; narration: string },
) {
  const { c, missing } = config();
  if (missing.length) {
    console.error(`Chango is not configured; missing: ${missing.join(", ")}`);
    throw new DonationError(
      "Donations are temporarily unavailable. Please try again later.",
      503,
    );
  }

  const body = {
    destinationCode: c.destinationCode,
    groupId: c.groupId,
    campaignId: c.campaignId,
    amount: input.amount,
    currency: "GHS",
    narration: opts.narration,
    recurring: false,
    paymentDestinationNumber: c.destination,
    channelId: input.paymentMethod === "card" ? "CARD" : "WALLET",
    platform: "web",
    countryId: "GH",
    anonymous: input.anonymous,
    pledgeRedemption: false,
    merchantProductId: c.merchantProductId,
    fullName: input.fullName,
    email: input.email,
    paymentMethod: input.paymentMethod,
    msisdn: input.msisdn,
    pageTitle: opts.pageTitle,
    pageDescription: opts.narration,
    timeout: 300,
    successRedirectUrl: `${opts.origin}/thank-you`,
    failureRedirectUrl: `${opts.origin}/payment-failed`,
  };

  let res: Response;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "api-key": c.apiKey!,
    "x-api-key": c.gatewayKey!,
    "transflow-id": c.transflowId!,
    merchantProductId: c.merchantProductId!,
  };
  try {
    res = await fetch(c.url!, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Chango request failed", error);
    throw new DonationError(
      "We couldn't reach the payment service. Please try again.",
    );
  }

  const json = await res.json().catch(() => null);
  // Check the envelope's response_code as well as the HTTP status (see the API docs).
  const ok =
    res.ok &&
    (json?.response_code === undefined || String(json.response_code) === "200");
  const checkoutUrl = ok ? findCheckoutUrl(json?.data ?? json) : undefined;
  if (!checkoutUrl) {
    console.error(
      "Chango rejected the transaction",
      res.status,
      JSON.stringify(json),
    );
    throw new DonationError(
      typeof json?.response_message === "string" && json.response_message
        ? json.response_message
        : "We couldn't start your donation. Please try again.",
    );
  }
  return checkoutUrl;
}
