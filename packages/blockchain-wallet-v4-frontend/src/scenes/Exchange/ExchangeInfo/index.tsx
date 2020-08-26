import { Box, Container } from 'components/Box'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { SuccessCartridge } from 'components/Cartridge'
import React, { useState } from 'react'
import styled from 'styled-components'

const ContainerWithBackground = styled(Container)`
  background-image: url('/img/swap-info.png');
  /* stylelint-disable */
  background-image: -webkit-image-set(
    url('/img/swap-info.png') 1x,
    url('/img/swap-info@2x.png') 2x
  );
  /* stylelint-enable */
  background-repeat: no-repeat;
  border-radius: 8px 8px 0 0;
  box-sizing: border-box;
  max-width: 328px;
  background-size: 333px 129px;
  margin-left: 24px;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`

const ExchangeInfo = () => {
  const [isVisible, setVisible] = useState(true)
  if (!isVisible) {
    return null
  }
  return (
    <ContainerWithBackground>
      <Box>
        <Header>
          <SuccessCartridge style={{ textTransform: 'uppercase' }}>
            <FormattedMessage id='copy.new' defaultMessage='New' />
          </SuccessCartridge>
          <Icon
            cursor
            name='close-circle'
            size='20px'
            color='grey400'
            onClick={() => setVisible(false)}
          />
        </Header>
        <div>
          <Text
            size='20px'
            weight={600}
            color='grey900'
            style={{ marginBottom: '10px' }}
          >
            <FormattedHTMLMessage
              id='swap.getstarted.readytoswap.info.title'
              defaultMessage='Swap is Now<br />Faster & Cheaper.'
            />
          </Text>
          <Text
            size='14px'
            weight={500}
            color='grey600'
            style={{ lineHeight: 1.5 }}
          >
            <FormattedMessage
              id='swap.getstarted.readytoswap.info.description'
              defaultMessage='Intrdoducing Swap with your Trade Wallets. The same Wallet you use to Buy & Sell can now access Swap. Save time and money with 100% off-chain swaps!'
            />
          </Text>
        </div>
      </Box>
    </ContainerWithBackground>
  )
}

export default ExchangeInfo
