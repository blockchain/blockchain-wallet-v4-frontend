import React from 'react'
import { FormattedMessage } from 'react-intl'
import { calcBasicInterest } from 'blockchain-wallet-v4-frontend/src/modals/Interest/conversions'
import styled from 'styled-components'

import { Button, Link, Modal, ModalBody, ModalHeader, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { BlueCartridge } from 'components/Cartridge'
import { WalletFiatType } from 'core/types'
import { model } from 'data'

import { Props as OwnProps, SuccessStateType } from './index'

const { INTEREST_EVENTS } = model.analytics

const ModalHeaderBorderless = styled(ModalHeader)`
  border-bottom: none;
  padding: 28px 38px 0 32px;
`
const ModalFooterBorderless = styled.div`
  border-top: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 32px 32px;
`
const ModalBodyStyled = styled(ModalBody)`
  padding: 28px 32px;
`

export const CustomBlueCartridge = styled(BlueCartridge)`
  display: flex;
  align-items: center;
  font-size: 14px;
`

type Props = OwnProps & SuccessStateType

const Success: React.FC<Props> = ({
  afterTransaction,
  analyticsActions,
  closeAll,
  interestActions,
  interestRate,
  position,
  total,
  walletCurrency
}) => {
  const { currency, fiatAmount, fiatCurrency } = afterTransaction
  const purchaseAmount = fiatAmount || 0
  const interestAmount = calcBasicInterest(purchaseAmount, interestRate[currency || 'BTC'])
  const worthCurrency = fiatCurrency || (walletCurrency as WalletFiatType)
  return (
    <Modal size='medium' position={position} total={total}>
      <ModalHeaderBorderless onClose={closeAll}>
        <CustomBlueCartridge>
          <FormattedMessage
            id='components.alerts.first_pax_trade_info_dyk'
            defaultMessage='Did you know?'
          />
        </CustomBlueCartridge>
      </ModalHeaderBorderless>
      <ModalBodyStyled>
        <Text size='24px' color='grey900' weight={600} style={{ marginTop: '16px' }}>
          <FormattedMessage
            id='modals.interestpromo.title'
            defaultMessage='Earn {interestRate}% Interest on your {coin}'
            values={{
              coin: 'BTC',
              interestRate: interestRate[currency]
            }}
          />
        </Text>
        <Text
          size='14px'
          color='grey600'
          weight={500}
          style={{ lineHeight: 1.5, marginTop: '4px', maxWidth: '414px' }}
        >
          <FormattedMessage
            id='modals.interestpromo.body'
            defaultMessage='Your recent {amount} purchase of {coin} could be worth <b>{worthAmount}*</b> in the next 12 months.'
            values={{
              amount: fiatToString({
                unit: worthCurrency,
                value: purchaseAmount
              }),
              coin: currency,
              worthAmount: fiatToString({
                unit: worthCurrency,
                value: interestAmount
              })
            }}
          />
        </Text>
        <Text
          size='12px'
          color='grey600'
          weight={500}
          style={{ lineHeight: 1.5, marginTop: '4px', maxWidth: '414px' }}
        >
          <FormattedMessage
            id='modals.interestpromo.disclaimer'
            defaultMessage='*Averaged periodic estimations based on current rate and price'
          />
        </Text>
      </ModalBodyStyled>
      <ModalFooterBorderless>
        <Button
          style={{ marginTop: '16px', maxWidth: '376px' }}
          nature='primary'
          data-e2e='startEarningInterestNow'
          fullwidth
          onClick={() => {
            interestActions.showInterestModal({ coin: currency, step: 'DEPOSIT' })
            analyticsActions.logEvent(INTEREST_EVENTS.MODAL.START_EARNING)
          }}
        >
          <FormattedMessage id='modals.interestpromo.button' defaultMessage='Start Earning Now' />
        </Button>
        <Link
          size='16px'
          weight={600}
          style={{
            marginTop: '16px',
            textAlign: 'center',
            width: '100%'
          }}
          onClick={() => {
            interestActions.stopShowingInterestModal()
            analyticsActions.logEvent(INTEREST_EVENTS.MODAL.DONT_SHOW_AGAIN)
          }}
        >
          <FormattedMessage
            id='modals.interestpromo.dont_show_again'
            defaultMessage='Don’t show again'
          />
        </Link>
      </ModalFooterBorderless>
    </Modal>
  )
}

export default Success
