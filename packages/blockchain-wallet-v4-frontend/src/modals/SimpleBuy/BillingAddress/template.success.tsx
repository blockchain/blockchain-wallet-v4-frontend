import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { Props as OwnProps, SuccessStateType } from '.'
import CountrySelect from './CountrySelect'
import React from 'react'
import styled from 'styled-components'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  border-bottom: 1px solid ${props => props.theme.grey000};
  padding-bottom: 0px;
`
const Top = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

export type Props = OwnProps & SuccessStateType

const Success: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  return (
    <>
      <CustomFlyoutWrapper>
        <Top color='grey800' size='20px' weight={600}>
          <Icon
            cursor
            name='arrow-left'
            size='20px'
            color='grey600'
            style={{ marginRight: '24px' }}
            role='button'
            onClick={() =>
              props.simpleBuyActions.setStep({
                step: 'ADD_CARD'
              })
            }
          />
          <FormattedMessage
            id='modals.simplebuy.billing_address'
            defaultMessage='Billing Address'
          />
        </Top>
        <CountrySelect {...props} />
      </CustomFlyoutWrapper>
      <FlyoutWrapper>Here</FlyoutWrapper>
    </>
  )
}

export default reduxForm<{}, Props>({ form: 'ccBillingAddress' })(Success)
