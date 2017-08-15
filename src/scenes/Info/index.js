import React from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-components'
import InfoWell from 'components/shared/InfoWell'
import WalletId from './WalletId'
import PairingCode from './PairingCode'

const Wrapper = styled.section`
  padding: 30px;
  box-sizing: border-box;
`

const Info = () => {
  return (
    <Wrapper>
      <InfoWell>
        <Text id='scenes.info.explain' text='Use your Wallet ID to log in using our web client,' small />
        <Text id='scenes.info.explain2' text='or simply scan the code below (click on `Show Pairing Code`) with your Blockchain Mobile Wallet (iOS or Android) to access your wallet on your mobile devices.' small />
      </InfoWell>
      <WalletId />
      <PairingCode />
    </Wrapper>
  )
}

export default Info
