import React from 'react'
import { FormattedMessage } from 'react-intl'
import { any } from 'ramda'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Box, Button, Image, Text } from 'blockchain-info-components'
import { SBPaymentMethodType, SBPaymentTypes, WalletFiatEnum } from 'blockchain-wallet-v4/src/types'
import { SettingComponent, SettingContainer, SettingSummary } from 'components/Setting'
import { BankTransferAccountType } from 'data/types'
import { getBankLogoImageName } from 'services/images'
import { media } from 'services/styles'

import { CardDetails, Child, CustomSettingHeader, RemoveButton } from '../styles'
import { Props as OwnProps, SuccessStateType } from '.'

const BankIconWrapper = styled.div`
  margin-right: 14px;
  justify-content: center;
  flex-direction: column;
  display: flex;
`

const CustomSettingComponent = styled(SettingComponent)`
  margin-top: 36px;
  ${media.tablet`
    margin-top: 8px;
  `}
`

const StyledSettingsContainer = styled(SettingContainer)`
  border-bottom: none;
`

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const walletBeneficiaries = props.bankAccounts.filter(
    (account) => account.currency in WalletFiatEnum
  )

  const isEligible = any(
    (method: SBPaymentMethodType) => method.type === SBPaymentTypes.BANK_TRANSFER
  )(props.paymentMethods.methods)
  return (
    <StyledSettingsContainer>
      <SettingSummary>
        <CustomSettingHeader>
          <FormattedMessage id='scenes.settings.linked_banks' defaultMessage='Linked Banks' />
        </CustomSettingHeader>
        <div>
          {!walletBeneficiaries.length && (
            <Text size='14px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.settings.no_linked_banks'
                defaultMessage='No Linked Banks'
              />
            </Text>
          )}
          {walletBeneficiaries.map((account) => {
            return (
              <Box
                key={account.id}
                onClick={() => props.handleShowBankClick(account)}
                data-e2e={`bankAccountRow-${account.id}`}
                isMethod
                isMobile={media.mobile}
                style={{ width: '430px' }}
              >
                <Child>
                  <BankIconWrapper>
                    <Image name={getBankLogoImageName(account.details?.bankName)} />
                  </BankIconWrapper>
                  <CardDetails>
                    <Text size='16px' color='grey800' weight={600}>
                      {account.details?.bankName}
                    </Text>
                    <Text size='14px' color='grey600' weight={500} capitalize>
                      {account.details?.bankAccountType?.toLowerCase() || ''}{' '}
                      <FormattedMessage
                        id='scenes.settings.general.account'
                        defaultMessage='account'
                      />{' '}
                      {account.details?.accountNumber || ''}
                    </Text>
                  </CardDetails>
                </Child>
                <Child>
                  <RemoveButton
                    data-e2e={`removeBankAccount-${account.id}`}
                    nature='light-red'
                    disabled={props.submitting}
                    style={{ marginLeft: '18px', minWidth: 'auto' }}
                    // @ts-ignore
                    onClick={(e: SyntheticEvent) => {
                      e.stopPropagation()
                      props.handleDeleteBank(account)
                    }}
                  >
                    <FormattedMessage id='buttons.remove' defaultMessage='Remove' />
                  </RemoveButton>
                </Child>
              </Box>
            )
          })}
        </div>
      </SettingSummary>
      {isEligible && (
        <CustomSettingComponent>
          <Button nature='primary' data-e2e='addBankFromSettings' onClick={props.handleBankClick}>
            <FormattedMessage id='buttons.add_bank' defaultMessage='Add a Bank' />
          </Button>
        </CustomSettingComponent>
      )}
    </StyledSettingsContainer>
  )
}

type Props = OwnProps &
  SuccessStateType & {
    handleBankClick: () => void
    handleDeleteBank: (account: BankTransferAccountType) => void
    handleShowBankClick: (account: BankTransferAccountType) => void
  }
export default reduxForm<{}, Props>({ form: 'linkedBanks' })(Success)
