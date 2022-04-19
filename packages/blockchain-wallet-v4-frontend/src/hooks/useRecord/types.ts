export type UseRecordHook = <
  T extends keyof any,
  RETURN,
  MAP extends Record<T, RETURN> = Record<T, RETURN>
>(
  pick: T,
  map: MAP
) => [MAP[T]]
