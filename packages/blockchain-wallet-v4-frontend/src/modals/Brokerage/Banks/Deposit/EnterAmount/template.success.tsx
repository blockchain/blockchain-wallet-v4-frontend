import React, { useEffect } from 'react'

import { LinkStatePropsType, Props as OwnProps, SuccessStateType } from '.'
// import Checkout from './Checkout'

const Success: React.FC<Props> = () => {
  useEffect(() => {}, [])

  return <div>hello world!</div>
}

export type Props = OwnProps & SuccessStateType & LinkStatePropsType

export default Success
