import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import Form from 'components/Form/Form'
import { getRedirectBackToStep } from 'data/components/brokerage/selectors'
import { deleteSavedBank } from 'data/components/brokerage/slice'
import { DeleteBankEndpointTypes } from 'data/types'

import { RemoveBankModalProps } from './types'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`
const ContentFlyout = styled(FlyoutWrapper)`
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

type Props = {
  entityType: DeleteBankEndpointTypes
  handleClose: () => void
} & Omit<RemoveBankModalProps, 'bankType'>

const Template: React.FC<InjectedFormProps<{}, Props> & Props> = ({
  accountId,
  accountNumber,
  bankName,
  entityType,
  handleClose,
  submitting
}) => {
  const dispatch = useDispatch()

  const redirectBackToStep = useSelector(getRedirectBackToStep)

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(deleteSavedBank({ bankId: accountId, bankType: entityType }))
  }

  return (
    <Wrapper>
      <ContentFlyout>
        {redirectBackToStep ? (
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
                onClick={handleClose}
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
              onClick={handleClose}
            />
          </CloseContainer>
        )}
        <CustomForm onSubmit={handleSubmit}>
          <Icon name='alert-filled' color='orange400' size='52px' style={{ display: 'block' }} />
          <Text color='grey800' size='24px' weight={600} style={{ marginTop: '32px' }}>
            <FormattedMessage
              id='modals.simplebuy.cancelorder.areyousure'
              defaultMessage='Are you sure?'
            />
          </Text>
          <Text
            color='grey600'
            size='14px'
            weight={500}
            style={{ marginBottom: '24px', marginTop: '12px' }}
          >
            <FormattedMessage
              id='modals.brokerage.remove_bank.description'
              defaultMessage="You're about to remove your {bankName} account ending in {accountNumber}"
              values={{ accountNumber, bankName }}
            />
          </Text>
          <Button
            fullwidth
            size='16px'
            height='48px'
            nature='light'
            data-e2e='removeLinkedBank'
            disabled={submitting}
            type='submit'
          >
            {submitting ? (
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
            disabled={submitting}
            onClick={handleClose}
            style={{ marginTop: '16px' }}
            type='button'
          >
            <FormattedMessage id='buttons.cancel' defaultMessage='Cancel' />
          </Button>
        </CustomForm>
      </ContentFlyout>
    </Wrapper>
  )
}

export default reduxForm<{}, Props>({ form: 'linkedBanks' })(Template)
