import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { BankTransferAccountType } from 'blockchain-wallet-v4/src/types'
import { FlyoutWrapper } from 'components/Flyout'
import { Form } from 'components/Form'

import { LinkDispatchPropsType, OwnProps } from '.'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`
const RemoveBankFlyout = styled(FlyoutWrapper)`
  display: flex;
  flex-direction: column;
`
const CustomForm = styled(Form)`
  text-align: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
`
const CloseContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`
const LeftTopCol = styled.div`
  display: flex;
  align-items: center;
`

type Props = OwnProps &
  LinkDispatchPropsType & {
    account: BankTransferAccountType
    redirectBack: boolean
  }

const Template: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  return (
    <Wrapper>
      <RemoveBankFlyout>
        {props.redirectBack ? (
          <TopText color='grey800' size='20px' weight={600}>
            <LeftTopCol>
              <Icon
                cursor
                data-e2e='brokerageBackToBankDetails'
                name='arrow-back'
                size='20px'
                color='grey600'
                role='button'
                style={{ marginRight: '8px' }}
                onClick={props.handleClose}
              />
              <Text color='grey800' size='24px' weight={600}>
                <FormattedMessage id='buttons.back' defaultMessage='Back' />
              </Text>
            </LeftTopCol>
          </TopText>
        ) : (
          <CloseContainer>
            <Icon
              cursor
              data-e2e='bankDetailsCloseIcon'
              name='close'
              size='20px'
              color='grey600'
              role='button'
              onClick={props.handleClose}
            />
          </CloseContainer>
        )}
        <CustomForm onSubmit={props.handleSubmit}>
          <Icon
            name='alert-filled'
            color='orange400'
            size='52px'
            style={{ display: 'block' }}
          />
          <Text
            color='grey800'
            size='24px'
            weight={600}
            style={{ marginTop: '32px' }}
          >
            <FormattedMessage
              id='modals.simplebuy.cancelorder.areyousure'
              defaultMessage='Are you sure?'
            />
          </Text>
          <Text
            color='grey600'
            size='14px'
            weight={500}
            style={{ marginTop: '12px', marginBottom: '24px' }}
          >
            <FormattedMessage
              id='modals.brokerage.remove_bank.description'
              defaultMessage="You're about to remove your {bankAccount}"
              values={{
                bankAccount: `${props.account.details?.bankName} ${props.account.details?.accountNumber}`
              }}
            />
          </Text>
          <Button
            fullwidth
            size='16px'
            height='48px'
            nature='light'
            data-e2e='removeLinkedBank'
            disabled={props.submitting}
            type='submit'
          >
            {props.submitting ? (
              <HeartbeatLoader color='blue100' height='20px' width='20px' />
            ) : (
              <FormattedMessage id='buttons.remove' defaultMessage='Remove' />
            )}
          </Button>
          <Button
            fullwidth
            size='16px'
            height='48px'
            nature='light'
            data-e2e='cancelRemoveOfLinkedBank'
            disabled={props.submitting}
            onClick={props.handleClose}
            style={{ marginTop: '16px' }}
            type='button'
          >
            <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
          </Button>
        </CustomForm>
      </RemoveBankFlyout>
    </Wrapper>
  )
}

export default reduxForm<{}, Props>({ form: 'linkedBanks' })(Template)
