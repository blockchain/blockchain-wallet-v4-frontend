import { Button, Icon, Text } from 'blockchain-info-components'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'core/exchange/currency'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { Props as OwnProps, SuccessStateType } from '.'
import {
  SettingContainer,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const CardWrapper = styled.div`
  display: flex;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  justify-content: space-between;
  border: 1px solid ${props => props.theme.grey000};
  cursor: pointer;
  width: 430px;

  ${media.mobile`
    width: 100%;
  `}
`
const CustomSettingHeader = styled(SettingHeader)`
  margin-bottom: 18px;
`
const RemoveButton = styled(Button)`
  &:hover {
    border-color: ${props => props.theme.red400};
    background-color: transparent;
  }
`
const BankIconWrapper = styled.div`
  margin-right: 14px;
  width: 24px;
  justify-content: center;
  flex-direction: column;
  display: flex;
`
const Child = styled.div`
  display: flex;
  div:last-child {
    margin-top: 4px;
  }
`
const CardDetails = styled.div<{ right?: boolean }>`
  text-align: ${props => (props.right ? 'right' : 'initial')};
`

const getAvailableAmount = (methods, currency) => {
  const method = methods.find(
    method => method.type === 'FUNDS' && method.currency === currency
  )
  return Number(method.limits.max)
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
                              getAvailableAmount(
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
                  <RemoveButton
                    data-e2e='removeCard'
                    nature='light-red'
                    disabled={props.submitting}
                    style={{ marginLeft: '18px', minWidth: 'auto' }}
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
export default reduxForm<{}, Props>({ form: 'linkedCards' })(Success)
