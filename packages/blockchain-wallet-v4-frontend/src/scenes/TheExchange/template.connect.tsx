import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css } from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { Box } from 'components/Box'
import { OrangeCartridge, SuccessCartridge } from 'components/Cartridge'

import { Props } from './template'
import LinkToExchange from './template.linktoexchange'

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
const cartridge = css`
  width: 120px;
`
const CustomOrangeCartridge = styled(OrangeCartridge)`
  ${cartridge}
`
const CustomSuccessCartridge = styled(SuccessCartridge)`
  ${cartridge}
`

const ExchangeConnect = (props: Props) => {
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
        {props.isExchangeAccountLinked ? (
          <>
            <CustomSuccessCartridge>
              <FormattedMessage
                id='scenes.exchange.empty.connected.cartridge'
                defaultMessage='Connected'
              />
            </CustomSuccessCartridge>
            {props.isExchangeRelinkRequired ? (
              <Button
                data-e2e='linkAgain'
                nature='primary'
                height='48px'
                fullwidth
                onClick={props.profileActions.shareWalletAddressesWithExchange}
              >
                <FormattedMessage
                  id='scenes.exchange.reconnectnow'
                  defaultMessage='Reconnect Now'
                />
              </Button>
            ) : (
              <LinkToExchange {...props} />
            )}
          </>
        ) : (
          <>
            <CustomOrangeCartridge>
              <FormattedMessage
                id='scenes.exchange.empty.notconnected.cartridge'
                defaultMessage='Not Connected'
              />
            </CustomOrangeCartridge>
            <Button
              data-e2e='connectToExchange'
              nature='primary'
              height='48px'
              fullwidth
              onClick={onSignup}
            >
              <FormattedMessage
                id='scenes.exchange.connectnow'
                defaultMessage='Connect Now'
              />
            </Button>
          </>
        )}
      </FootWrapper>
    </Box>
  )
}

export default ExchangeConnect
