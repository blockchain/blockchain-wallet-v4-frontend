import { CardDetails, CardWrapper, Child, CustomSettingHeader } from '../styles'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'core/exchange/currency'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { Props as OwnProps, SuccessStateType } from '.'
import { SBPaymentMethodType, WalletFiatType } from 'core/types'
import { SettingContainer, SettingSummary } from 'components/Setting'
import React from 'react'
import styled from 'styled-components'

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
  return 0
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  return (
    <SettingContainer>
      <SettingSummary>
        <CustomSettingHeader>
          <FormattedMessage
            id='scenes.settings.linked_banks'
            defaultMessage='Linked Banks'
          />
        </CustomSettingHeader>
        <div>
          {props.beneficiaries.map((beneficiary, i) => {
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

                    <Text size='14px' color='grey600' weight={500}>
                      <FormattedMessage
                        id='scenes.settings.linked_banks.daily_limit'
                        defaultMessage='{amount} Daily Limit'
                        values={{
                          amount: fiatToString({
                            value: convertBaseToStandard(
                              'FIAT',
                              getAvailableAmountForCurrency(
                                props.paymentMethods.methods,
                                beneficiary.currency
                              )
                            ),
                            unit: beneficiary.currency || 'EUR'
                          })
                        }}
                      />
                    </Text>
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
