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
  bottom: 0;
  right: 0;
  background: ${({ theme }) => theme.white};
  height: fit-content;
  border-radius: 50%;
  padding: ${({ padding }) => padding};
`

const ActiveRewardsIcon = ({ coin }) => (
  <Wrapper size='80px'>
    <Icon name={coin} size='72px' />
    <SubIconWrapper padding='4px'>
      <Image name='earn-clock' size='36px' />
    </SubIconWrapper>
  </Wrapper>
)

export default ActiveRewardsIcon
