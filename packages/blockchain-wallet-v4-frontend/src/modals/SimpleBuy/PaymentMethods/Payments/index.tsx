import { FlyoutWrapper } from 'components/Flyout'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { Props as OwnProps, SuccessStateType } from '../index'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
`

export type Props = OwnProps & SuccessStateType

const Payments: React.FC<InjectedFormProps<{}, Props> & Props> = props => {
  return (
    <Wrapper>
      <Form>
        <FlyoutWrapper>
          <TopText color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='modals.simplebuy.paymentmethods'
              defaultMessage='Payment Methods'
            />
            <Icon
              cursor
              data-e2e='sbCloseModalIcon'
              name='close'
              size='20px'
              color='grey600'
              role='button'
              onClick={props.handleClose}
            />
          </TopText>
        </FlyoutWrapper>
      </Form>
    </Wrapper>
  )
}

export default reduxForm<{}, Props>({
  form: 'sbPaymentMethods',
  destroyOnUnmount: false
})(Payments)
