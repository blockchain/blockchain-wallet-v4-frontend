import React from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'
import { Box } from 'components/Box'

import { Props } from '../template.success'
import { AirdropInfoButton, AirdropInfoCopy, AirdropInfoHeader } from './model'

const Footer = styled.div`
  margin-top: 16px;
`

const AirdropBox = styled(Box)`
  background-image: url('/img/airdrop-welcome.png');
  /* stylelint-disable */
  background-image: -webkit-image-set(
    url('/img/airdrop-welcome.png') 1x,
    url('/img/airdrop-welcome@2x.png') 2x
  );
  /* stylelint-enable */
  background-repeat: no-repeat;
`

const AirdropInfo = (props: Props) => {
  return (
    <AirdropBox>
      <Icon name='parachute' color='green600' size='32px' />
      <AirdropInfoHeader />
      <AirdropInfoCopy {...props} />
      <Footer>
        <AirdropInfoButton {...props} />
      </Footer>
    </AirdropBox>
  )
}

export default AirdropInfo
