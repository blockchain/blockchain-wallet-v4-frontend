import { Button, Image, Text } from 'blockchain-info-components'
import {
  CardDetails,
  CardWrapper,
  Child,
  CustomSettingHeader,
  RemoveButton
} from '../styles'
import { FormattedMessage } from 'react-intl'
import { getBankLogoImageName } from 'services/ImagesService'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { Props as OwnProps, SuccessStateType } from '.'
import {
  SettingComponent,
  SettingContainer,
  SettingSummary
} from 'components/Setting'
import { WalletFiatEnum } from 'core/types'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const BankIconWrapper = styled.div`
  margin-right: 14px;
  justify-content: center;
  flex-direction: column;
  display: flex;
`

const CapText = styled(Text)`
  text-transform: capitalize;
`

const CustomSettingComponent = styled(SettingComponent)`
  margin-top: 36px;
  ${media.tablet`
    margin-top: 8px;
  `}
`

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  const walletBeneficiaries = props.bankAccounts.filter(
    account => account.currency in WalletFiatEnum
  )

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
          {!walletBeneficiaries.length && (
            <Text size='14px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.settings.no_linked_banks'
                defaultMessage='No Linked Banks'
              />
            </Text>
          )}
          {walletBeneficiaries.map((account, i) => {
            return (
              <CardWrapper key={i}>
                <Child>
                  <BankIconWrapper>
                    <Image
                      name={getBankLogoImageName(account.details?.bankName)}
                    />
                  </BankIconWrapper>
                  <CardDetails>
                    <Text size='16px' color='grey800' weight={600}>
                      {account.details.bankName}
                    </Text>
                    <CapText size='14px' color='grey600' weight={500}>
                      {account.details?.bankAccountType.toLowerCase()}{' '}
                      <FormattedMessage
                        id='scenes.settings.general.account'
                        defaultMessage='account'
                      />{' '}
                      {account.details?.accountNumber}
                    </CapText>
                  </CardDetails>
                </Child>
                <Child>
                  <RemoveButton
                    data-e2e='removeBankAccount'
                    nature='light-red'
                    disabled={props.submitting}
                    style={{ marginLeft: '18px', minWidth: 'auto' }}
                    // @ts-ignore
                    onClick={(e: SyntheticEvent) => {
                      e.stopPropagation()
                      props.simpleBuyActions.deleteSavedBank(account.id)
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
      <CustomSettingComponent>
        <Button
          nature='primary'
          data-e2e='addCardFromSettings'
          onClick={() => props.handleBankClick()}
        >
          <FormattedMessage id='buttons.add_bank' defaultMessage='Add a Bank' />
        </Button>
      </CustomSettingComponent>
    </SettingContainer>
  )
}

type Props = OwnProps & SuccessStateType & { handleBankClick: () => void }
export default reduxForm<{}, Props>({ form: 'linkedBanks' })(Success)
