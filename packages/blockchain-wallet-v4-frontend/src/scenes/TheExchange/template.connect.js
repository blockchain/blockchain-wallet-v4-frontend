import { Box } from 'components/Box'
import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { OrangeCartridge } from 'components/Cartridge'
import React from 'react'
import styled from 'styled-components'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  & > :first-child {
    margin-bottom: 20px;
  }
`

const FootWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  & > :first-child {
    margin-bottom: 20px;
  }
`

const CustomOrangeCartridge = styled(OrangeCartridge)`
  width: 120px;
`

const ExchangeConnect = props => {
  const { onSignup } = props
  return (
    <Box>
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
      <FootWrapper>
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
      </FootWrapper>
    </Box>
  )
}

export default ExchangeConnect
