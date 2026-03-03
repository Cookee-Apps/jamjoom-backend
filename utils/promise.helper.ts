export function safePromiseCall<T>(promise: Promise<T>) {
  promise.then().catch();
}
