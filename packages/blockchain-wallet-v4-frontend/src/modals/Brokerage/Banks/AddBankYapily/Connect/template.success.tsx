import React from 'react'

import { Props as _P, SuccessStateType as _SS } from '.'

type Props = _SS & _P

const Success = (props: Props) => {
  return <>{props.bankCredentials.id}</>
}

export default Success
