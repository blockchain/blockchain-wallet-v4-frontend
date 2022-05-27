import { useMemo } from 'react'

import { UseRecordHook } from './types'

export const useRecord: UseRecordHook = (pick, map) =>
  useMemo(() => {
    return [map[pick]]
  }, [pick, map])
