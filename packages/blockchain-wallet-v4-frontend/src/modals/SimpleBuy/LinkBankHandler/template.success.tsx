import React from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

import { FastLinkType } from 'data/types'
import { FlyoutWrapper } from 'components/Flyout'
import { Props as OwnProps, State, SuccessStateType } from '.'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
  margin-top: 16px;
`

const Success: React.FC<Props> = props => {
  return (
    <CustomFlyoutWrapper>
      <>
        <Icon
          cursor
          name='arrow-left'
          size='20px'
          color='grey600'
          role='button'
          onClick={() => {
            props.handleBackButton(props.fastLink)
          }}
        />
        <Iframe src={props.iFrameUrl} />
      </>
    </CustomFlyoutWrapper>
  )
}

type Props = OwnProps &
  State &
  SuccessStateType & { handleBackButton: (fastLink: FastLinkType) => void }

export default Success
