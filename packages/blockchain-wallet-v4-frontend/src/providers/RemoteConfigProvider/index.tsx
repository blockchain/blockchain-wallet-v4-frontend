import React, { useLayoutEffect } from 'react'

import { useRemoteConfigPresenter } from './hooks/useRemoteConfigPresenter'

type Props = {
  children: React.ReactNode
}

export const RemoteConfigProvider = ({ children }: Props) => {
  const { initialize } = useRemoteConfigPresenter()

  useLayoutEffect(() => {
    initialize()
  }, [initialize])

  return <>{children}</>
}
