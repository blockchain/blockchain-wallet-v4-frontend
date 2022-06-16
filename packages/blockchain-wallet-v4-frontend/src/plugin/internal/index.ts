/**
 * Exposes all internal plugin logic that may be used inside application.
 */
export class ChromePlugin {
  // Indicates if application is chrome browser extension.
  public static isPlugin(): boolean {
    return window.location.protocol === 'chrome-extension:'
  }
}
