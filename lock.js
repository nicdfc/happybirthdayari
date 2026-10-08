// The code and the secret message are not stored in plain text, so peeking at
// the page source won't give the answer away. The message is scrambled with a
// keystream derived from the code; only the right code unscrambles it.
const SECRET = "N+T+MkOlMPU1mYzummBd5RdeG6pEVzCUxfvsxB/pWMQvB/YTe8bGg5dKJhrnvITT4QgJEu4t0MVuI6jcB58fi5TfmAgLjHypeIlcLSe+KLg=";

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

// Returns the message if the code is right, otherwise null.
function tryUnlock(code) {
  const next = keystream(code);
  const raw = atob(SECRET);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i) ^ next();
  let text;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (e) {
    return null;
  }
  return text.startsWith("OK|") ? text.slice(3) : null;
}
