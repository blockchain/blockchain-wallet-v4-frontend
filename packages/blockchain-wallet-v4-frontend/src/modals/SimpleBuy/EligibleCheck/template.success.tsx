import { FlyoutWrapper } from 'components/Flyout'
import { SuccessStateType } from '.'
import React from 'react'

type Props = SuccessStateType

const Success: React.FC<Props> = props => {
  return (
    <FlyoutWrapper>
      {/* Placeholder */}
      {!props.eligible && <div>This is awkward...user not eligible</div>}
      {props.eligible && <div>User is eligible</div>}
    </FlyoutWrapper>
  )
}

export default Success
