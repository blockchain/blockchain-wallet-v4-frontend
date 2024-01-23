import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { IconBank, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import { BSPaymentMethodsType, BSPaymentTypes, WalletFiatEnum } from '@core/types'
import { Coin } from '@core/utils'
import { Box, Button, Image, Text } from 'blockchain-info-components'
import { Expanded, Flex } from 'components/Flex'
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

  const bankLimit = paymentMethods?.methods.find(
    (method) => method.type === BSPaymentTypes.BANK_TRANSFER
  )?.limits

  const walletBeneficiaries = bankAccounts.filter((account) => account.currency in WalletFiatEnum)

  const isEligible = paymentMethods.methods.some(
    (method) => method.type === BSPaymentTypes.BANK_TRANSFER
  )

  return (
    <StyledSettingsContainer>
      <SettingSummary>
        <CustomSettingHeader>
          <FormattedMessage id='scenes.settings.linked_banks' defaultMessage='Linked Banks' />
        </CustomSettingHeader>
        <div>
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
            return (
              <Box
                key={account.id}
                onClick={() => handleShowBankClick(account)}
                data-e2e={`bankAccountRow-${account.id}`}
                isMethod
                isMobile={media.mobile}
                style={{ width: '430px' }}
              >
                <Flex style={{ width: '100%' }} gap={8}>
                  <Flex alignItems='center'>
                    <Image name={getBankLogoImageName(account.details?.bankName)} />
                  </Flex>

                  <Expanded style={{ minWidth: 0 }}>
                    <Flex flexDirection='column'>
                      <Flex justifyContent='space-between'>
                        <Text
                          size='16px'
                          color='grey800'
                          weight={600}
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {account.details?.bankName}
                        </Text>

                        <Text size='14px' color='grey600' weight={500} capitalize>
                          ***{account.details.accountNumber}
                        </Text>
                      </Flex>

                      <Flex justifyContent='space-between'>
                        <Text size='14px' color='grey600' weight={500} capitalize>
                          {bankLimit && (
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
                          )}
                        </Text>

                        <Text size='14px' color='grey600' weight={500} capitalize>
                          {account.details?.bankAccountType?.toLowerCase()}
                        </Text>
                      </Flex>
                    </Flex>
                  </Expanded>
                </Flex>
              </Box>
            )
          })}
        </div>
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
