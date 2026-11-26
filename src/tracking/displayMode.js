// Browser/Standalone-Kennung, einheitlich für PostHog und Piano.
// Ein Icon allein bestätigt keine Installation; maßgeblich ist der tatsächliche Anzeigemodus.
export function getStandaloneMode(win = window) {
  try {
    return win.matchMedia?.("(display-mode: standalone)")?.matches === true
      || win.navigator?.standalone === true;
  } catch {
    return false;
  }
}
