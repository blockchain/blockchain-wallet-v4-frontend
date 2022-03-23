import { useMemo } from 'react'

export const useLast = <T extends unknown = unknown>(value: T[]): T =>
  useMemo(() => value[value.length - 1], [value])
