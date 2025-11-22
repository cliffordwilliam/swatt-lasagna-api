export function assignSafe<TPayload extends Record<string, unknown>, TTarget>(
  payload: TPayload,
  target: TTarget,
): TTarget {
  const withoutUndefined = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(payload).filter(([_, value]) => value !== undefined),
  );

  const targetAsRecord = target as unknown as Record<string, unknown>;
  const filtered = Object.fromEntries(
    Object.entries(withoutUndefined).filter(([key]) => key in targetAsRecord),
  );

  Object.assign(targetAsRecord, filtered);

  return target;
}
