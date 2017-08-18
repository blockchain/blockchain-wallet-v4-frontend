import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Grid } from 'react-bootstrap'

import { Image } from 'blockchain-info-components'

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
const BitcoinPicture = styled(Image)`
  max-width: 80%;
`

const NewToBitcoin = (props) => {
  return (
    <NewToBitcoinWrapper>
      <NewToBitcoinContainer>
        <NewToBitcoinBlock>
          <BitcoinSummary>
            <FormattedMessage id='scenes.landing.newtobitcoin.new' defaultMessage='New to bitcoin ?' />
            <FormattedMessage id='scenes.landing.newtobitcoin.current' defaultMessage='Like paper money and gold before it, bitcoin is a currency that allows parties to exchange value.' />
            <FormattedMessage id='scenes.landing.newtobitcoin.decentralized' defaultMessage="Unlike it's predecessors, bitcoin is digital and decentralized." />
            <FormattedMessage id='scenes.landing.newtobitcoin.history' defaultMessage='For the first time in history, people can exchange value without intermediaries which translates to greater control of funds and lower fees.' />
          </BitcoinSummary>
        </NewToBitcoinBlock>
        <NewToBitcoinBlock>
          <BitcoinNetwork>
            <BitcoinPicture name='bitcoin-network' />
          </BitcoinNetwork>
        </NewToBitcoinBlock>
      </NewToBitcoinContainer>
    </NewToBitcoinWrapper>
  )
}

export default NewToBitcoin
