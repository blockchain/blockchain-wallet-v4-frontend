import React from 'react'

import { Props as OwnProps } from '..'

const NftOrderStatus: React.FC<Props> = (props) => {
  return <div>{props.orderFlow.status}</div>
}

type Props = OwnProps

export default NftOrderStatus
