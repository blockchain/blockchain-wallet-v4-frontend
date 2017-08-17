import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import sophisticated from 'img/sophisticated.svg'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;

  @media(min-width: 768px) { flex-direction: row; }
`
const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  min-height: 150px;
  padding: 0 50px;
  text-align: justify;
`
const BlockHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
const BlockIconSophisticated = styled.img.attrs({
  src: sophisticated
})`
  height: 50px;
  margin: 15px 0;
`

const Page1 = () => (
  <Page>
    <Block>
      <BlockHeader>
        <BlockIconSophisticated />
        <FormattedMessage id='scenes.landing.wallet.simple' defaultMessage='Simple' />
      </BlockHeader>
      <FormattedMessage id='scenes.landing.wallet.simple_explain' defaultMessage='We make using bitcoin safe, simple, and fun. Securely store your bitcoin and instantly transact with anyone in the world' />
    </Block>
    <Block>
      <BlockHeader>
        <BlockIconSophisticated />
        <FormattedMessage id='scenes.landing.wallet.safe' defaultMessage='Safe & Secure' />
      </BlockHeader>
      <FormattedMessage id='scenes.landing.wallet.safe_explain' defaultMessage='Our step-by-step Security Center helps you backup your funds, and protect them from unauthorized access.' />
    </Block>
    <Block>
      <BlockHeader>
        <BlockIconSophisticated />
        <FormattedMessage id='scenes.landing.wallet.buy' defaultMessage='Buy & Sell' />
      </BlockHeader>
      <FormattedMessage id='scenes.landing.wallet.buy_explain' defaultMessage='Blockchain works with exchange partners all around the world to make buying bitcoin in your wallet both a seamless and secure experience.' />
    </Block>
  </Page>
)

export default Page1
