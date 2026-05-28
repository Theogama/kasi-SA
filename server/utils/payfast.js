import crypto from "crypto";

const encodePayfastValue = (value) =>
  encodeURIComponent(String(value).trim()).replace(/%20/g, "+");

export const buildPayfastSignature = (data, passphrase = "") => {
  const pairs = Object.keys(data)
    .filter((key) => key !== "signature" && data[key] !== "" && data[key] !== undefined && data[key] !== null)
    .sort()
    .map((key) => `${key}=${encodePayfastValue(data[key])}`);

  let payload = pairs.join("&");
  if (passphrase) {
    payload += `&passphrase=${encodePayfastValue(passphrase)}`;
  }

  return crypto.createHash("md5").update(payload).digest("hex");
};

export const verifyPayfastSignature = (payload, passphrase = "") => {
  const received = payload.signature;
  if (!received) return false;

  const expected = buildPayfastSignature(payload, passphrase);
  return expected === received;
};

export const isPayfastPaymentComplete = (paymentStatus) =>
  String(paymentStatus || "").toUpperCase() === "COMPLETE";
