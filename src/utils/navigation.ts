export function replaceUrl(path: string) {
  window.history.replaceState({}, '', path);
}
