type UnauthorizedHandler = () => void;

let handler: UnauthorizedHandler | null = null;

/** Registers the callback invoked when an authenticated request is rejected with 401. */
export function setUnauthorizedHandler(next: UnauthorizedHandler | null): void {
  handler = next;
}

export function notifyUnauthorized(): void {
  handler?.();
}
