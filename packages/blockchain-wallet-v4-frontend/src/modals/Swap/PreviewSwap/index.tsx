import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import { Props as BaseProps } from '..'
import {
  Button,
  HeartbeatLoader,
  Icon,
  SpinningLoader,
  Text
} from 'blockchain-info-components'
import { coinToString } from 'core/exchange/currency'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { InitSwapFormValuesType, SwapAmountFormValues } from 'data/types'
import { TopText } from '../components'

class PreviewSwap extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  state = {}

  handleSubmit = e => {
    e.preventDefault()
    this.props.swapActions.createOrder()
  }

  render () {
    if (
      !this.props.initSwapFormValues?.BASE ||
      !this.props.initSwapFormValues?.COUNTER
    ) {
      return this.props.swapActions.setStep({ step: 'INIT_SWAP' })
    }

    const { BASE, COUNTER } = this.props.initSwapFormValues

    return (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween={false} marginBottom>
            <Icon
              role='button'
              name='arrow-left'
              cursor
              size='24px'
              color='grey600'
              onClick={() =>
                this.props.swapActions.setStep({
                  step: 'ENTER_AMOUNT'
                })
              }
            />{' '}
            <Text
              size='20px'
              color='grey900'
              weight={600}
              style={{ marginLeft: '24px' }}
            >
              <FormattedMessage
                id='copy.confirm_swap'
                defaultMessage='Confirm Swap'
              />
            </Text>
          </TopText>
        </FlyoutWrapper>
        <Row>
          <Title>
            <FormattedMessage id='copy.swap' defaultMessage='Swap' />
          </Title>
          <Value>
            {coinToString({
              value: this.props.swapAmountFormValues?.amount,
              unit: { symbol: BASE.coin }
            })}
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
          </Title>
          <Value>
            {this.props.incomingAmountR.cata({
              Success: value => (
                <>{coinToString({ value, unit: { symbol: COUNTER.coin } })}</>
              ),
              Failure: e => e,
              Loading: () => (
                <SpinningLoader borderWidth='4px' height='14px' width='14px' />
              ),
              NotAsked: () => (
                <SpinningLoader borderWidth='4px' height='14px' width='14px' />
              )
            })}
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='copy.from' defaultMessage='From' />
          </Title>
          <Value>{BASE.label}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='copy.to' defaultMessage='To' />
          </Title>
          <Value>{COUNTER.label}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='copy.coin_network_fee'
              defaultMessage='{coin} Network Fee'
              values={{ coin: BASE.coin }}
            />
          </Title>
          <Value>Outgoing fee</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='copy.coin_network_fee'
              defaultMessage='{coin} Network Fee'
              values={{ coin: COUNTER.coin }}
            />
          </Title>
          <Value>Incoming fee</Value>
        </Row>
        <FlyoutWrapper>
          <Form onSubmit={this.handleSubmit}>
            <Button
              nature='primary'
              data-e2e='swapBtn'
              type='submit'
              disabled={this.props.submitting}
              fullwidth
              jumbo
            >
              {this.props.submitting ? (
                <HeartbeatLoader height='16px' width='16px' color='white' />
              ) : (
                <FormattedMessage
                  id='buttons.swap_x_for_y'
                  defaultMessage='Swap {base} for {counter}'
                  values={{ base: BASE.coin, counter: COUNTER.coin }}
                />
              )}
            </Button>
            {this.props.error && (
              <ErrorCartridge
                style={{ marginTop: '16px' }}
                data-e2e='checkoutError'
              >
                <Icon
                  name='alert-filled'
                  color='red600'
                  style={{ marginRight: '4px' }}
                />
                Error: {this.props.error}
              </ErrorCartridge>
            )}
          </Form>
        </FlyoutWrapper>
      </>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  initSwapFormValues: selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType,
  swapAmountFormValues: selectors.form.getFormValues('swapAmount')(
    state
  ) as SwapAmountFormValues,
  incomingAmountR: selectors.components.swap.getIncomingAmount(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, Props>({ form: 'previewSwap', destroyOnUnmount: false }),
  connector
)

type OwnProps = BaseProps & { handleClose: () => void }
export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(PreviewSwap) as React.ComponentClass<OwnProps>
