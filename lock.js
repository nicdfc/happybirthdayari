// The codes and the secret messages are not stored in plain text, so peeking
// at the page source won't give the answers away. Each message is scrambled
// with a keystream derived from its code; only the right code unscrambles it.
const SECRETS = [
  "N+T+EA69MbJ9zNvFm3BW5RRCTrZPUzuU2OCpih/mTsh7AfxEPsTNwNwEKwiptYrI4ggfH+Vowd1nYLmUFtcOk9XOmFsLlz2kN45LfjuoaaXaP/7Y3QU8wvafHKz4HWl6tVceRXuZ3h2Or/ZXLxgFn3ruuil3IDVjcZWSOAxa",
  "Vc0PYiEIyk48f+LEYkQsM8FosJAIRUDinePFIQhvJqg1z3/StsHMD9SX53RQ",
];

function keystream(code) {
  let h = 2166136261 >>> 0;
  for (const c of code) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  let s = h;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) & 255;
  };
}

// Returns { msg, footer, alien } if the code opens one of the secrets, otherwise null.
function tryUnlock(code) {
  for (const secret of SECRETS) {
    const found = unscramble(secret, code);
    if (found) return found;
  }
  return null;
}

function unscramble(secret, code) {
  const next = keystream(code);
  const raw = atob(secret);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i) ^ next();
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (e) {
    return null;
  }
  if (!text.startsWith("OK|")) return null;
  try {
    return JSON.parse(text.slice(3));
  } catch (e) {
    return null;
  }
}
