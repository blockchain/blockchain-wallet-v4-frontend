import React from 'react'

import { useSardine } from 'hooks'

type Props = React.PropsWithChildren<{}>

const WithDeviceIntelligence: React.FC<Props> = function (props: Props) {
  useSardine()
  return <>{props.children}</>
}

export default WithDeviceIntelligence
