/**
 * Suppresses CSS transitions during theme changes to prevent smearing.
 */
export function suppressTransitions(fn: () => void) {
  if (typeof document === "undefined") {
    fn();
    return;
  }
  const el = document.documentElement;
  el.classList.add("no-transitions");
  fn();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.remove("no-transitions");
    });
  });
}
