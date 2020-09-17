import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { Box, Container } from 'components/Box'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { SuccessCartridge } from 'components/Cartridge'
import React from 'react'
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
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`

const ExchangeInfo = ({ preferencesActions }: Props) => {
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
            onClick={preferencesActions.hideSwapInfoBanner}
          />
        </Header>
        <div>
          <Text
            size='20px'
            weight={600}
            color='grey900'
            style={{ marginBottom: '10px', width: '175px' }}
          >
            <FormattedMessage
              id='swap.getstarted.readytoswap.info.title'
              defaultMessage='Swap is Now Faster & Cheaper.'
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
              defaultMessage='Introducing Swap with your Trading Wallets. The same Wallet you use to Buy & Sell can now be used to Swap. Save time and money with 100% off-chain swaps!'
            />
          </Text>
        </div>
      </Box>
    </ContainerWithBackground>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})
const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(ExchangeInfo)
