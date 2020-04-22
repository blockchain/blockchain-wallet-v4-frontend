import { FlyoutWrapper } from 'components/Flyout'
import { Props as OwnProps, SuccessStateType } from '.'
import React from 'react'
import styled from 'styled-components'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
`

const Success: React.FC<Props> = props => {
  return (
    <CustomFlyoutWrapper>
      <Iframe src={props.providerDetails.everypay.paymentLink} />
    </CustomFlyoutWrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
