import { AirdropInfoButton, AirdropInfoCopy, AirdropInfoHeader } from './model'
import { Icon } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Footer = styled.div`
  margin-top: 16px;
`

export const Box = styled.div`
  padding: 24px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme['grey000']};
  width: 300px;
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

const AirdropInfo = props => {
  return (
    <AirdropBox>
      <Icon name='parachute' color='green600' size='32px' />
      <AirdropInfoHeader {...props} />
      <AirdropInfoCopy {...props} />
      <Footer>
        <AirdropInfoButton {...props} />
      </Footer>
    </AirdropBox>
  )
}

export default AirdropInfo
