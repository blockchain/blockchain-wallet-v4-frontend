import React from 'react'

import AddBankWireForm from '../AddBankWireForm'
import { Props as OwnProps, SuccessStateType } from '.'

const Success = (props: Props) => {
  // console.log(props)

  return <AddBankWireForm />
}

type Props = OwnProps & SuccessStateType

export default Success
