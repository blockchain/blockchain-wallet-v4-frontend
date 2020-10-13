import { Field, Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { Props as BaseProps } from '..'
import { compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FlyoutWrapper } from 'components/Flyout'
import { Icon, Text } from 'blockchain-info-components'
import { selectors } from 'data'

const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`
const StyledForm = styled(Form)`
  margin-top: 36px;
`
const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${props => `1px solid ${props.theme.grey000}`};
  padding: 16px 40px;
  cursor: pointer;
`

class InitSwapForm extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  state = {}

  render () {
    return (
      <>
        <FlyoutWrapper>
          <TopText>
            <Icon name='arrow-switch-thick' color='blue600' size='24px' />
            <Icon
              name='close'
              color='grey600'
              role='button'
              cursor
              onClick={this.props.handleClose}
            />
          </TopText>
          <Text size='24px' color='grey900' weight={600}>
            <FormattedMessage id='copy.new_swap' defaultMessage='New Swap' />
          </Text>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            style={{ marginTop: '10px' }}
          >
            <FormattedMessage
              id='copy.select_swap_wallets'
              defaultMessage='Select the Wallet you want to Swap from and the crypto you want to receive.'
            />
          </Text>
        </FlyoutWrapper>
        <StyledForm>
          <Field
            name='BASE'
            component={() => (
              <Option
                role='button'
                onClick={() =>
                  this.props.swapActions.setStep({
                    step: 'COIN_SELECTION',
                    options: {
                      side: 'BASE'
                    }
                  })
                }
              >
                <div>
                  <Text color='grey600' weight={500} size='14px'>
                    Swap from
                  </Text>
                  <>
                    <Text
                      color='grey900'
                      weight={600}
                      style={{ marginTop: '4px' }}
                    >
                      Select a Wallet
                    </Text>
                    <Text
                      color='grey900'
                      weight={600}
                      size='14px'
                      style={{ marginTop: '4px' }}
                    >
                      This is the crypto you send.
                    </Text>
                  </>
                </div>
                <Icon name='chevron-right' size='20px' color='grey400' />
              </Option>
            )}
          />
          <Field
            name='COUNTER'
            component={() => (
              <Option
                role='button'
                onClick={() =>
                  this.props.swapActions.setStep({
                    step: 'COIN_SELECTION',
                    options: {
                      side: 'COUNTER'
                    }
                  })
                }
              >
                <div>
                  <Text color='grey600' weight={500} size='14px'>
                    Receive to
                  </Text>
                  <>
                    <Text
                      color='grey900'
                      weight={600}
                      style={{ marginTop: '4px' }}
                    >
                      Select a Wallet
                    </Text>
                    <Text
                      color='grey900'
                      weight={600}
                      size='14px'
                      style={{ marginTop: '4px' }}
                    >
                      This is the crypto you get.
                    </Text>
                  </>
                </div>
                <Icon name='chevron-right' size='20px' color='grey400' />
              </Option>
            )}
          />
        </StyledForm>
      </>
    )
  }
}

const mapStateToProps = state => ({
  values: selectors.form.getFormValues('initSwap')(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  reduxForm<{}, Props>({ form: 'initSwap', destroyOnUnmount: false }),
  connector
)

type OwnProps = BaseProps & { handleClose: () => void }

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(InitSwapForm) as React.ComponentClass<OwnProps>
