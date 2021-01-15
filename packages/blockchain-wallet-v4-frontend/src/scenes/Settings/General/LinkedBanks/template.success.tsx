import {
  CardDetails,
  CardWrapper,
  Child,
  CustomSettingHeader,
  RemoveButton
} from '../styles'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'core/exchange/currency'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { Props as OwnProps, SuccessStateType } from '.'
import { SBPaymentMethodType, WalletFiatEnum, WalletFiatType } from 'core/types'
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
  return null
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const walletBeneficiaries = props.bankAccounts.filter(
    account => account.currency in WalletFiatEnum
  )

  if (!walletBeneficiaries.length) return null

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
          {props.bankAccounts.map((account, i) => {
            const availableAmount = getAvailableAmountForCurrency(
              props.paymentMethods.methods,
              account.currency as WalletFiatType
            )
            return (
              <CardWrapper key={i}>
                <Child>
                  <BankIconWrapper>
                    <Icon name='bank-filled' color='blue600' size='16px' />
                  </BankIconWrapper>
                  <CardDetails>
                    <Text size='16px' color='grey800' weight={600}>
                      {account.details.bankName}
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
                              unit: (account.currency ||
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
                      ····{account.details.accountNumber}
                    </Text>
                    <Text size='16px' color='grey800' weight={600}>
                      {account.details.accountName}
                    </Text>
                  </CardDetails>
                  <RemoveButton
                    data-e2e='removeBankAccount'
                    nature='light-red'
                    disabled={props.submitting}
                    style={{ marginLeft: '18px', minWidth: 'auto' }}
                    // @ts-ignore
                    onClick={(e: SyntheticEvent) => {
                      e.stopPropagation()
                      props.brokerageActions.deleteSavedBank(account.id)
                    }}
                  >
                    <FormattedMessage
                      id='buttons.remove'
                      defaultMessage='Remove'
                    />
                  </RemoveButton>
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
