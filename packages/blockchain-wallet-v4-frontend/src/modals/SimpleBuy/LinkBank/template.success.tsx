import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormGroup } from 'components/Form'
import { SBAddCardErrorType } from 'data/types'

import { Props as OwnProps, SuccessStateType } from '.'

const CustomFlyoutWrapper = styled(FlyoutWrapper)`
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`

const Success: React.FC<InjectedFormProps<{}, Props, ErrorType> & Props> = ({
  handleSubmit,
  submitting
}) => {
  return (
    <CustomFlyoutWrapper>
      <TopText color='grey800' size='20px' weight={600}>
        <Icon
          cursor
          name='arrow-left'
          size='20px'
          color='grey600'
          role='button'
          style={{ marginRight: '24px' }}
          onClick={() =>
            // eslint-disable-next-line
            window.alert('TODO')
          }
        />
        <FormattedMessage
          id='buttons.link_bank'
          defaultMessage='Link a Bank Account'
        />
      </TopText>
      <Form onSubmit={handleSubmit}>
        <FormGroup margin='24px'>Click continue to contact Yodlee</FormGroup>
        <FormGroup>
          <Button
            nature='primary'
            data-e2e='linkBankContinue'
            height='48px'
            size='16px'
            type='submit'
            disabled={submitting}
          >
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Button>
        </FormGroup>
      </Form>
    </CustomFlyoutWrapper>
  )
}

export type Props = OwnProps & SuccessStateType
export type ErrorType = SBAddCardErrorType

export default reduxForm<{}, Props, ErrorType>({
  form: 'linkBankForm',
  destroyOnUnmount: false
})(Success)
