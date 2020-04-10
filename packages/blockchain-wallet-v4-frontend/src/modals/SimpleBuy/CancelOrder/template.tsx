import { Button, HeartbeatLoader, Icon, Text } from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper } from 'components/Flyout'
import { Form } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import { LinkDispatchPropsType, OwnProps } from '.'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const CustomForm = styled(Form)`
  text-align: center;
`

type Props = OwnProps & LinkDispatchPropsType

const Template: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  return (
    <Wrapper>
      <FlyoutWrapper>
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
            weight={500}
            size='16px'
            lineHeight='150%'
            style={{ marginTop: '8px', marginBottom: '48px' }}
          >
            <FormattedMessage
              id='modals.simplebuy.cancelorder.outcome'
              defaultMessage='Cancelling this {pair} Buy will remove your order. You can always create a new order from the menu if you cancel now.'
              values={{
                pair: props.order.pair
              }}
            />
          </Text>
          {props.error && (
            <div style={{ marginBottom: '16px' }}>
              <ErrorCartridge>Error: {props.error}</ErrorCartridge>
            </div>
          )}
          <Button
            fullwidth
            size='16px'
            height='48px'
            nature='light'
            data-e2e='cancelSBOrder'
            disabled={props.submitting}
            type='submit'
          >
            {props.submitting ? (
              <HeartbeatLoader color='blue100' height='20px' width='20px' />
            ) : (
              <FormattedMessage
                id='modals.simplebuy.cancelorder.cancel'
                defaultMessage='Yes. Cancel Order'
              />
            )}
          </Button>
          <Button
            fullwidth
            size='16px'
            height='48px'
            nature='primary'
            data-e2e='cancelSBOrder'
            disabled={props.submitting}
            onClick={() =>
              props.simpleBuyActions.setStep({
                step:
                  props.order.state === 'PENDING_CONFIRMATION'
                    ? 'CHECKOUT_CONFIRM'
                    : 'ORDER_SUMMARY',
                order: props.order
              })
            }
            style={{ marginTop: '16px' }}
            type='button'
          >
            <FormattedMessage
              id='modals.simplebuy.cancelorder.goback'
              defaultMessage='No. Go Back'
            />
          </Button>
        </CustomForm>
      </FlyoutWrapper>
    </Wrapper>
  )
}

export default reduxForm<{}, Props>({ form: 'cancelSBOrderForm' })(Template)
