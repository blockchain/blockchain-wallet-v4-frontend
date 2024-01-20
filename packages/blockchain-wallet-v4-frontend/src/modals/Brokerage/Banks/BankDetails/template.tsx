import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { getCurrency } from '@core/redux/settings/selectors'
import { BSPaymentTypes } from '@core/types'
import { Button, HeartbeatLoader, Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { modals } from 'data/actions'
import { brokerage } from 'data/components/actions'
import { ModalName } from 'data/types'
import { getBankLogoImageName } from 'services/images'

import { BankDetailsModalProps } from './types'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`
const BankFlyoutWrapper = styled(FlyoutWrapper)`
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  height: 100%;
`
const DisclaimerWrapper = styled(FlyoutWrapper)`
  justify-content: center;
  display: flex;
`
const CloseContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`
const CurrencyContainer = styled.div`
  margin-top: 35px;
  display: flex;
  flex-direction: column;
  padding: 16px 0 16px 40px;
  border-top: 1px solid ${(props) => props.theme.grey000};
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`
const BankIconWrapper = styled.div`
  justify-content: left;
  flex-direction: row;
  display: flex;
`

export const BankDetails = styled.div`
  margin-top: 24px;
`

type Props = {
  handleClose: () => void
} & BankDetailsModalProps

const Template: React.FC<InjectedFormProps<{}, Props> & Props> = ({
  accountId,
  accountNumber,
  accountType,
  bankName,
  bankType,
  handleClose,
  submitting
}) => {
  const dispatch = useDispatch()
  const walletCurrency = useSelector(getCurrency).getOrElse('USD')

  const onClick = () => {
    dispatch(brokerage.setRedirectBackToStep(true))

    dispatch(
      modals.showModal(
        ModalName.REMOVE_BANK_MODAL,
        { origin: 'BankDetailsModal' },
        {
          accountId,
          accountNumber,
          bankName,
          bankType
        }
      )
    )
  }

  return (
    <Wrapper>
      <FlyoutWrapper>
        <CloseContainer>
          <Icon
            cursor
            data-e2e='bankDetailsCloseIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={handleClose}
          />
        </CloseContainer>

        <BankIconWrapper>
          <Image name={getBankLogoImageName(bankName)} />
        </BankIconWrapper>
        <BankDetails>
          <Text size='24px' color='grey900' weight={600} capitalize>
            {bankName ?? <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />}
          </Text>
          <Text size='24px' color='grey600' weight={500} capitalize>
            {accountType.toLowerCase() || ''}{' '}
            <FormattedMessage id='scenes.settings.general.account' defaultMessage='account' />{' '}
            {accountNumber || ''}
          </Text>
        </BankDetails>
      </FlyoutWrapper>
      <CurrencyContainer>
        <Text color='grey600' size='14px' weight={500}>
          <FormattedMessage id='copy.currency' defaultMessage='Currency' />
        </Text>
        <Text color='grey800' size='16px' weight={600}>
          {walletCurrency}
        </Text>
      </CurrencyContainer>
      <DisclaimerWrapper>
        <Text
          color='grey600'
          size='12px'
          weight={500}
          style={{ marginTop: '40px', textAlign: 'center' }}
        >
          {bankType === BSPaymentTypes.BANK_ACCOUNT ? (
            <FormattedMessage
              id='modals.brokerage.bank_preview.disclaimer_wires'
              defaultMessage='This account can be used for withdrawals only.'
            />
          ) : (
            <FormattedMessage
              id='modals.brokerage.bank_preview.disclaimer'
              defaultMessage='This account can be used for buys, sells & withdrawals.'
            />
          )}
        </Text>
      </DisclaimerWrapper>
      <BankFlyoutWrapper>
        <Button
          fullwidth
          size='16px'
          height='48px'
          nature='light-red'
          data-e2e='removeBankDetails'
          disabled={submitting}
          onClick={onClick}
        >
          {submitting ? (
            <HeartbeatLoader color='blue100' height='20px' width='20px' />
          ) : (
            <FormattedMessage id='buttons.remove' defaultMessage='Remove' />
          )}
        </Button>
      </BankFlyoutWrapper>
    </Wrapper>
  )
}

export default reduxForm<{}, Props>({ form: 'linkedBanks' })(Template)
