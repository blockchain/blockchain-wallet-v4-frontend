import React from 'react'
import styled from 'styled-components'

import { Grid, Text } from 'blockchain-info-components'
import bitcoinNetwork from 'img/bitcoin-network.svg'

const NewToBitcoinWrapper = styled.div`
  background-color: #FFFFFF;
  padding: 50px 0;
`

const NewToBitcoinContainer = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media(min-width: 768px) { flex-direction: row; }
`
const NewToBitcoinBlock = styled.div`
  flex-grow: 1;
  width: 100%;
  padding: 30px;
`
const BitcoinSummary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: justify;
`
const BitcoinNetwork = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const BitcoinPicture = styled.img.attrs({
  src: bitcoinNetwork
})`
  max-width: 80%;
`

const NewToBitcoin = (props) => {
  return (
    <NewToBitcoinWrapper>
      <NewToBitcoinContainer>
        <NewToBitcoinBlock>
          <BitcoinSummary>
            <Text id='scenes.landing.newtobitcoin.new' text='New to bitcoin ?' giant lighter uppercase />
            <Text id='scenes.landing.newtobitcoin.current' text='Like paper money and gold before it, bitcoin is a currency that allows parties to exchange value.' light />
            <Text id='scenes.landing.newtobitcoin.decentralized' text="Unlike it's predecessors, bitcoin is digital and decentralized." light />
            <Text id='scenes.landing.newtobitcoin.history' text='For the first time in history, people can exchange value without intermediaries which translates to greater control of funds and lower fees.' light />
          </BitcoinSummary>
        </NewToBitcoinBlock>
        <NewToBitcoinBlock>
          <BitcoinNetwork>
            <BitcoinPicture />
          </BitcoinNetwork>
        </NewToBitcoinBlock>
      </NewToBitcoinContainer>
    </NewToBitcoinWrapper>
  )
}

export default NewToBitcoin
