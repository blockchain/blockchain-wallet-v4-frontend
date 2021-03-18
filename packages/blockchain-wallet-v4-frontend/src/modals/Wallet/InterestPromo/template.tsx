import React from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { calcCompoundInterest } from 'blockchain-wallet-v4-frontend/src/modals/Interest/conversions'
import styled from 'styled-components'

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { BlueCartridge } from 'components/Cartridge'
import { WalletFiatType } from 'core/types'
import { convertBaseToStandard } from 'data/components/exchange/services'

import { Props as OwnProps, SuccessStateType } from './index'

const ModalHeaderBorderless = styled(ModalHeader)`
  border-bottom: none;
  padding: 28px 38px 0 32px;
`
const ModalFooterBorderless = styled(ModalFooter)`
  border-top: none;
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
  closeAll,
  interestActions,
  interestRate,
  position,
  total,
  walletCurrency
}) => {
  const { amount, currency } = afterTransaction
  const worthAmount = calcCompoundInterest(
    amount || 0,
    interestRate[currency || 'BTC'],
    1
  )
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
        <Text
          size='24px'
          color='grey900'
          weight={600}
          style={{ marginTop: '16px' }}
        >
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
          style={{ marginTop: '4px', lineHeight: 1.5, maxWidth: '414px' }}
        >
          <FormattedHTMLMessage
            id='modals.interestpromo.body'
            defaultMessage='Your recent {amount} purchase of {coin} could be worth <b>{worthAmount}*</b> in the next 12 months.'
            values={{
              amount: fiatToString({
                value: convertBaseToStandard('FIAT', amount || 0),
                unit: walletCurrency as WalletFiatType
              }),
              coin: currency,
              worthAmount: worthAmount
            }}
          />
        </Text>
        <Text
          size='12px'
          color='grey600'
          weight={500}
          style={{ marginTop: '4px', lineHeight: 1.5, maxWidth: '414px' }}
        >
          <FormattedMessage
            id='modals.interestpromo.disclaimer'
            defaultMessage='*Averaged periodic estimations based on current rate and price'
          />
        </Text>
      </ModalBodyStyled>
      <ModalFooterBorderless align='center'>
        <Button
          style={{ marginTop: '16px', maxWidth: '376px' }}
          nature='primary'
          data-e2e='earnInterestNow'
          fullwidth
          onClick={() => {
            interestActions.showInterestModal('DEPOSIT', currency, true)
          }}
        >
          <FormattedMessage
            id='modals.interestpromo.button'
            defaultMessage='Start Earning Now'
          />
        </Button>
      </ModalFooterBorderless>
    </Modal>
  )
}

export default Success
