import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { IconBank, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { BSPaymentMethodsType, BSPaymentTypes, WalletFiatEnum } from '@core/types'
import { Coin } from '@core/utils'
import { Button, Image } from 'blockchain-info-components'
import { StandardRow } from 'components/Rows'
import { SettingComponent, SettingContainer, SettingSummary } from 'components/Setting'
import { modals } from 'data/actions'
import { brokerage } from 'data/components/actions'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { BankTransferAccountType, BrokerageModalOriginType, ModalName } from 'data/types'
import { getBankLogoImageName } from 'services/images'
import { media } from 'services/styles'

import { CustomSettingHeader } from '../styles'

const CustomSettingComponent = styled(SettingComponent)`
  margin-top: 36px;
  ${media.tablet`
    margin-top: 8px;
  `}
`

const StyledSettingsContainer = styled(SettingContainer)`
  border-bottom: none;
`

const ItemsWrapper = styled.div`
  display: grid;
  grid-template-columns: 430px;
  row-gap: 1rem;
`

const ItemWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 0.5rem;
`

const Success: React.FC<Props> = ({ bankAccounts, paymentMethods }) => {
  const dispatch = useDispatch()

  const handleBankClick = () => {
    dispatch(
      brokerage.showModal({
        modalType: 'SELECT_ADD_BANK_TYPE',
        origin: BrokerageModalOriginType.ADD_BANK_SETTINGS
      })
    )
  }

  const handleShowBankClick = (account: BankTransferAccountType) => {
    dispatch(
      modals.showModal(
        ModalName.BANK_DETAILS_MODAL,
        {
          origin: 'SettingsGeneral'
        },
        {
          accountId: account.id,
          accountNumber: account.details.accountNumber,
          accountType: account.details.bankAccountType,
          bankName: account.details.bankName,
          bankType: BSPaymentTypes.BANK_TRANSFER
        }
      )
    )
  }

  const foundBankTransfer = paymentMethods.methods.find(
    (method) => method.type === BSPaymentTypes.BANK_TRANSFER
  )

  const isEligible = !!foundBankTransfer

  const bankLimit = foundBankTransfer?.limits

  const walletBeneficiaries = bankAccounts.filter((account) => account.currency in WalletFiatEnum)

  return (
    <StyledSettingsContainer>
      <SettingSummary>
        <CustomSettingHeader>
          <FormattedMessage id='scenes.settings.linked_banks' defaultMessage='Linked Banks' />
        </CustomSettingHeader>
        <ItemsWrapper>
          {!walletBeneficiaries.length && (
            <StandardRow
              topLeftText={
                <FormattedMessage
                  id='scenes.settings.no_linked_banks'
                  defaultMessage='No Linked Banks'
                />
              }
              bottomLeftText={
                <FormattedMessage
                  id='scenes.settings.linked_banks_will_show'
                  defaultMessage='Your linked banks will show here'
                />
              }
              icon={<IconBank size='medium' color={PaletteColors['blue-600']} />}
              bottomRightText=''
              topRightText=''
            />
          )}
          {walletBeneficiaries.map((account) => {
            const type = account.details?.bankAccountType?.toLowerCase()
            const accountType = type ? type.charAt(0).toUpperCase() + type.slice(1) : undefined

            return (
              <ItemWrapper key={account.id} onClick={() => handleShowBankClick(account)}>
                <StandardRow
                  icon={<Image name={getBankLogoImageName(account.details?.bankName)} />}
                  topLeftText={account.details?.bankName}
                  topRightText={`***${account.details.accountNumber}`}
                  bottomLeftText={
                    bankLimit && (
                      <FormattedMessage
                        id='modals.simplebuy.card_limits'
                        defaultMessage='{limitAmount} Limit'
                        values={{
                          limitAmount: fiatToString({
                            unit: account.currency,
                            value: convertBaseToStandard(Coin.FIAT, bankLimit.max)
                          })
                        }}
                      />
                    )
                  }
                  bottomRightText={accountType}
                />
              </ItemWrapper>
            )
          })}
        </ItemsWrapper>
      </SettingSummary>
      {isEligible && (
        <CustomSettingComponent>
          <Button nature='primary' data-e2e='addBankFromSettings' onClick={handleBankClick}>
            <FormattedMessage id='buttons.add_bank' defaultMessage='Add a Bank' />
          </Button>
        </CustomSettingComponent>
      )}
    </StyledSettingsContainer>
  )
}

type Props = {
  bankAccounts: BankTransferAccountType[]
  paymentMethods: BSPaymentMethodsType
}

export default Success
