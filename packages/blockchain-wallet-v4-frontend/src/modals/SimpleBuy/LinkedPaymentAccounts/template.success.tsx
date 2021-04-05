import React from 'react'

import { LinkStatePropsType, Props as OwnProps, SuccessStateType } from '.'
import Accounts from './Accounts'

const Success: React.FC<Props> = props => {
  return <Accounts {...props} />
}

export type Props = OwnProps &
  SuccessStateType &
  LinkStatePropsType & { cryptoCurrency?: string }

export default Success
