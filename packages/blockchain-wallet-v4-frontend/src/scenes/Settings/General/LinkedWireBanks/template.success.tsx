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
import { Image, Text } from 'blockchain-info-components'
import { StandardRow } from 'components/Rows'
import { SettingContainer, SettingSummary } from 'components/Setting'
import { modals } from 'data/actions'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { ModalName } from 'data/types'
import { getBankLogoImageName } from 'services/images'

const ItemsWrapper = styled.div`
  display: grid;
  grid-template-columns: 430px;
  row-gap: 1rem;
`

const ItemWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 0.5rem;
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

  if (!walletBeneficiaries.length) return null

  return (
    <SettingContainer>
      <SettingSummary>
        <ItemsWrapper>
          {walletBeneficiaries.map((beneficiary) => {
            const availableAmount = getAvailableAmountForCurrency(
              paymentMethods.methods,
              beneficiary.currency as WalletFiatType
            )
            return (
              <ItemWrapper key={beneficiary.id} onClick={() => onBankClick(beneficiary)}>
                <StandardRow
                  icon={<Image name={getBankLogoImageName(beneficiary.agent)} />}
                  topLeftText={beneficiary.name}
                  topRightText={beneficiary.address}
                  bottomLeftText={
                    availableAmount && (
                      <Text size='14px' color='grey600' weight={500}>
                        <FormattedMessage
                          id='scenes.settings.linked_banks.daily_limit'
                          defaultMessage='{amount} Limit'
                          values={{
                            amount: fiatToString({
                              unit: beneficiary.currency as WalletFiatType,
                              value: convertBaseToStandard('FIAT', availableAmount)
                            })
                          }}
                        />
                      </Text>
                    )
                  }
                  bottomRightText='Wire'
                />
              </ItemWrapper>
            )
          })}
        </ItemsWrapper>
      </SettingSummary>
    </SettingContainer>
  )
}

export default reduxForm<{}, Props>({ form: 'linkedBanks' })(Success)
