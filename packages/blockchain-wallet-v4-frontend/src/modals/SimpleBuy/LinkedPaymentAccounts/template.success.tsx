import { LinkStatePropsType, Props as OwnProps, SuccessStateType } from '.'
import Accounts from './Accounts'
import React from 'react'

const Success: React.FC<Props> = props => {
  return <Accounts {...props} />
}

export type Props = OwnProps &
  SuccessStateType &
  LinkStatePropsType & { cryptoCurrency?: string }

export default Success
