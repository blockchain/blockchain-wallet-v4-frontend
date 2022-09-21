import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import BigNumber from 'bignumber.js'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { OrderType } from '@core/types'
import { Button, Icon, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import { actions } from 'data'
import { useOpenSendCryptoModal } from 'hooks'

const MoreEth = styled(Text)`
  display: flex;
  justify-content: space-between;
  padding: 1em;
  border: 1px solid ${(props) => props.theme.blue500};
  border-radius: 12px;
`

const GetMoreEthComponent: React.FC<Props> = (props) => {
  const openOpenSendCryptoModal = useOpenSendCryptoModal()
  const { amtToBuy, custodialBalance } = props
  const sendButtonCallback = () => openOpenSendCryptoModal({ coin: 'ETH', origin: 'NftsMakeOffer' })

  return (
    <>
      <MoreEth>
        <div style={{ display: 'flex' }}>
          <Icon size='32px' name='ETH' />{' '}
          <div style={{ display: 'block', padding: '0em 1em' }}>
            {new BigNumber(custodialBalance).isGreaterThan(amtToBuy) ? (
              <>
                <Text size='12px' weight={400}>
                  Send ETH from Trading Wallet
                </Text>
                <Text weight={600}>
                  <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                    {amtToBuy}
                  </CoinDisplay>
                </Text>
              </>
            ) : (
              <>
                <Text size='12px' weight={400} style={{ textAlign: 'left' }}>
                  Get More ETH
                </Text>
                <Text weight={600}>
                  <CoinDisplay size='14px' color='black' weight={600} coin='ETH'>
                    {amtToBuy}
                  </CoinDisplay>
                </Text>
              </>
            )}
          </div>
        </div>
        {new BigNumber(custodialBalance).isGreaterThan(amtToBuy) ? (
          <Button
            size='xsmall'
            small
            rounded
            nature='primary'
            data-e2e='buyMoreEth'
            width='40px'
            onClick={sendButtonCallback}
          >
            <FormattedMessage id='copy.send' defaultMessage='Send' />
          </Button>
        ) : (
          <Button
            size='xsmall'
            small
            rounded
            nature='primary'
            data-e2e='buyMoreEth'
            width='40px'
            onClick={() => {
              props.buySellActions.showModal({
                orderType: OrderType.BUY,
                origin: 'NftsMakeOffer'
              })
            }}
          >
            <FormattedMessage id='copy.buy' defaultMessage='Buy' />
          </Button>
        )}
      </MoreEth>
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  amount: string
  amtToBuy: BigNumber
  custodialBalance: BigNumber
  selfCustodyBalance: BigNumber
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(GetMoreEthComponent)
