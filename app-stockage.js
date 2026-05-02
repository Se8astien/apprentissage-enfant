export function stockageGet(key) {
  try { return localStorage.getItem(key); }
  catch { return null; }
}

export function stockageSet(key, value) {
  try { localStorage.setItem(key, value); }
  catch { /* ignore */ }
}

export function stockageRemove(key) {
  try { localStorage.removeItem(key); }
  catch { /* ignore */ }
}
