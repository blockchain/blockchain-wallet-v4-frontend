import React from 'react'
import styled from 'styled-components'

import { Image } from 'blockchain-info-components'

import Icon from './Icon'

const Wrapper = styled.div`
  position: relative;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`
const SubIconWrapper = styled.div`
  position: absolute;
  bottom: ${({ position }) => position.bottom ?? 'auto'};
  top: ${({ position }) => position.top ?? 'auto'};
  right: ${({ position }) => position.right};
  background: ${({ theme }) => theme.white};
  height: fit-content;
  border-radius: 50%;
  padding: ${({ padding }) => padding};
`

const ActiveRewardsIcon = ({ coin, type }) => {
  let wrapperSize = '68px'
  let subIconPosition = {
    right: '-2px',
    top: '-12px'
  }
  let subIconPadding = '2px'
  let iconSize = '56px'

  if (type === 'SUBMITTED') {
    wrapperSize = '80px'
    iconSize = '72px'
    subIconPadding = '4px'
    subIconPosition = { bottom: '0', right: '0' }
  }

  return (
    <Wrapper size={wrapperSize}>
      <Icon name={coin} size={iconSize} />
      <SubIconWrapper padding={subIconPadding} position={subIconPosition}>
        {type === 'SUBMITTED' ? (
          <Image name='earn-clock' size='36px' />
        ) : (
          <Icon name='bars-circle' color='blue600' size='30px' />
        )}
      </SubIconWrapper>
    </Wrapper>
  )
}

export default ActiveRewardsIcon
