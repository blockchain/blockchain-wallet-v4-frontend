import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import {
  BeneficiariesType,
  BeneficiaryType,
  BSPaymentMethodsType,
  BSPaymentMethodType,
  BSPaymentTypes,
  WalletFiatEnum,
  WalletFiatType
} from '@core/types'
import { Box, Image, Text } from 'blockchain-info-components'
import { SettingContainer, SettingSummary } from 'components/Setting'
import { modals } from 'data/actions'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { ModalName } from 'data/types'
import { getBankLogoImageName } from 'services/images'
import { media } from 'services/styles'

import { CardDetails, Child } from '../styles'

const BankIconWrapper = styled.div`
  margin-right: 14px;
  justify-content: center;
  flex-direction: column;
  display: flex;
`

const getAvailableAmountForCurrency = (
  methods: BSPaymentMethodType[],
  currency: WalletFiatType
) => {
  const method = methods.find(
    (method) => method.type === BSPaymentTypes.FUNDS && method.currency === currency
  )
  if (method) {
    return Number(method.limits.max)
  }
  return null
}

type Props = {
  beneficiaries: BeneficiariesType
  paymentMethods: BSPaymentMethodsType
}

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = ({
  beneficiaries,
  paymentMethods
}) => {
  const dispatch = useDispatch()

  const walletBeneficiaries = beneficiaries.filter(
    (beneficiary) => beneficiary.currency in WalletFiatEnum
  )

  const onBankClick = (beneficiary: BeneficiaryType) => {
    dispatch(
      modals.showModal(
        ModalName.BANK_DETAILS_MODAL,
        {
          origin: 'SettingsGeneral'
        },
        {
          accountId: beneficiary.id,
          accountNumber: beneficiary.address,
          accountType: 'Wire',
          bankType: BSPaymentTypes.BANK_ACCOUNT
        }
      )
    )
  }

  if (!walletBeneficiaries.length) return <SettingContainer />

  return (
    <SettingContainer>
      <SettingSummary>
        <div>
          {walletBeneficiaries.map((beneficiary) => {
            const availableAmount = getAvailableAmountForCurrency(
              paymentMethods.methods,
              beneficiary.currency as WalletFiatType
            )
            return (
              <Box
                style={{ width: '430px' }}
                isMobile={media.mobile}
                key={beneficiary.id}
                onClick={() => onBankClick(beneficiary)}
              >
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
                          defaultMessage='{amount} Limit'
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

export default reduxForm<{}, Props>({ form: 'linkedBanks' })(Success)
