import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Box, Image, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import {
  SBPaymentMethodType,
  SBPaymentTypes,
  WalletFiatEnum,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'
import { SettingContainer, SettingSummary } from 'components/Setting'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getBankLogoImageName } from 'services/images'
import { media } from 'services/styles'

import { CardDetails, Child } from '../styles'
import { Props as OwnProps, SuccessStateType } from '.'

const BankIconWrapper = styled.div`
  margin-right: 14px;
  justify-content: center;
  flex-direction: column;
  display: flex;
`

const getAvailableAmountForCurrency = (
  methods: SBPaymentMethodType[],
  currency: WalletFiatType
) => {
  const method = methods.find(
    (method) => method.type === SBPaymentTypes.FUNDS && method.currency === currency
  )
  if (method) {
    return Number(method.limits.max)
  }
  return null
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const walletBeneficiaries = props.beneficiaries.filter(
    (beneficiary) => beneficiary.currency in WalletFiatEnum
  )

  return (
    <SettingContainer>
      <SettingSummary>
        <div>
          {walletBeneficiaries.map((beneficiary) => {
            const availableAmount = getAvailableAmountForCurrency(
              props.paymentMethods.methods,
              beneficiary.currency as WalletFiatType
            )
            return (
              <Box style={{ width: '430px' }} isMobile={media.mobile} key={beneficiary.id}>
                <Child>
                  <BankIconWrapper>
                    <Image name={getBankLogoImageName(beneficiary.agent)} />
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
                              unit: (beneficiary.currency || 'EUR') as WalletFiatType,
                              value: convertBaseToStandard('FIAT', availableAmount)
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
              </Box>
            )
          })}
        </div>
      </SettingSummary>
    </SettingContainer>
  )
}

type Props = OwnProps & SuccessStateType
export default reduxForm<{}, Props>({ form: 'linkedBanks' })(Success)
