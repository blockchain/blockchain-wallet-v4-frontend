import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { OrangeCartridge } from 'components/Cartridge'
import React from 'react'
import styled from 'styled-components'

const BorderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 290px;
  width: 280px;
  border: solid 1px ${props => props.theme.grey000};
  border-radius: 8px;
  padding: 24px;
`
const Content = styled.div`
  & > :first-child {
    margin-bottom: 20px;
  }
`
const CustomOrangeCartridge = styled(OrangeCartridge)`
  width: 130px;
`

const ExchangeConnect = props => {
  const { onSignup } = props
  return (
    <BorderWrapper>
      <Content>
        <Text size='20px' weight={600} color='grey800'>
          <FormattedMessage
            id='scenes.exchange.empty.walletconnect.header'
            defaultMessage='Wallet Connect'
          />
        </Text>
        <Text size='14px' weight={500} color='grey600' lineHeight='20px'>
          <FormattedMessage
            id='scenes.exchange.empty.walletconnect.body'
            defaultMessage='Easily connect your Wallet to the Exchange and send crypto back and forth. No need to copy past wallet addresses all while keeping control of your private keys.'
          />
        </Text>
      </Content>
      <CustomOrangeCartridge>
        <FormattedMessage
          id='scenes.exchange.empty.notconnected.cartridge'
          defaultMessage='Not Connected'
        />
      </CustomOrangeCartridge>
      <Button nature='primary' height='48px' fullwidth onClick={onSignup}>
        <FormattedMessage
          id='scenes.exchange.connectnow'
          defaultMessage='Connect Now'
        />
      </Button>
    </BorderWrapper>
  )
}

export default ExchangeConnect
