import React from 'react'
import styled from 'styled-components'

import { FlyoutWrapper } from 'components/Flyout'

import { Props as OwnProps, State, SuccessStateType } from '.'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
  margin: 0;
  padding: 0;
`
const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
`

const Success: React.FC<Props> = props => {
  return (
    <CustomFlyoutWrapper>
      <Iframe src={props.iFrameUrl} />
    </CustomFlyoutWrapper>
  )
}

type Props = OwnProps & State & SuccessStateType

export default Success
