import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import {
  SBPaymentMethodType,
  WalletFiatEnum,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import { SettingContainer, SettingSummary } from 'components/Setting'
import { convertBaseToStandard } from 'data/components/exchange/services'

import { CardDetails, CardWrapper, Child } from '../styles'
import { Props as OwnProps, SuccessStateType } from '.'

const BankIconWrapper = styled.div`
  margin-right: 14px;
  width: 24px;
  justify-content: center;
  flex-direction: column;
  display: flex;
`

const getAvailableAmountForCurrency = (
  methods: SBPaymentMethodType[],
  currency: WalletFiatType
) => {
  const method = methods.find(
    method => method.type === 'FUNDS' && method.currency === currency
  )
  if (method) {
    return Number(method.limits.max)
  }
  return null
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const walletBeneficiaries = props.beneficiaries.filter(
    beneficiary => beneficiary.currency in WalletFiatEnum
  )

  return (
    <SettingContainer>
      <SettingSummary>
        <div>
          {walletBeneficiaries.map((beneficiary, i) => {
            const availableAmount = getAvailableAmountForCurrency(
              props.paymentMethods.methods,
              beneficiary.currency as WalletFiatType
            )
            return (
              <CardWrapper key={i}>
                <Child>
                  <BankIconWrapper>
                    <Icon name='bank-filled' color='blue600' size='16px' />
                  </BankIconWrapper>
                  <CardDetails>
                    <Text size='16px' color='grey800' weight={600}>
                      {beneficiary.name}
                    </Text>

                    {availableAmount && (
                      <Text size='14px' color='grey600' weight={500}>
                        <FormattedMessage
                          id='scenes.settings.linked_banks.daily_limit'
                          defaultMessage='{amount} Daily Limit'
                          values={{
                            amount: fiatToString({
                              value: convertBaseToStandard(
                                'FIAT',
                                availableAmount
                              ),
                              unit: (beneficiary.currency ||
                                'EUR') as WalletFiatType
                            })
                          }}
                        />
                      </Text>
                    )}
                  </CardDetails>
                </Child>
                <Child>
                  <CardDetails right>
                    <Text size='16px' color='grey800' weight={600}>
                      {beneficiary.address}
                    </Text>
                  </CardDetails>
                </Child>
              </CardWrapper>
            )
          })}
        </div>
      </SettingSummary>
    </SettingContainer>
  )
}

type Props = OwnProps & SuccessStateType
export default reduxForm<{}, Props>({ form: 'linkedBanks' })(Success)
