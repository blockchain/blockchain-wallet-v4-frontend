import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { formatCoin } from '@core/exchange/utils'
import {
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  SkeletonRectangle,
  Text,
  TextGroup
} from 'blockchain-info-components'
import { ErrorCartridge } from 'components/Cartridge'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { GenericNabuErrorFlyout } from 'components/GenericNabuErrorFlyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics, InitSwapFormValuesType, SwapAmountFormValues } from 'data/types'
import { isNabuError } from 'services/errors'

import { Props as BaseProps, SuccessStateType } from '..'
import { FeeBreakdownBox, FromToLogoLeft, TopText } from '../components'

const StyledRow = styled(Row)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 24px;

  & > div:first-child {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
const ToolTipText = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  background-color: ${(props) => props.theme.grey000};

  animation: fadeIn 0.3s ease-in-out;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const ExchangeRateRow = styled.div`
  display: flex;
`
const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
`
class PreviewSwap extends PureComponent<InjectedFormProps<{}, Props> & Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      isActiveExchangeToolTip: false
    }
  }

  componentDidMount() {
    this.props.analyticsActions.trackEvent({
      key: Analytics.SWAP_CHECKOUT_VIEWED,
      properties: {}
    })
  }

  componentWillUnmount() {
    this.clearSubmitErrors()
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.swapActions.createOrder()

    this.props.analyticsActions.trackEvent({
      key: Analytics.SWAP_CHECKOUT_SCREEN_SUBMITTED,
      properties: {}
    })
  }

  handleOnClickBack = () => {
    this.props.swapActions.setStep({
      step: 'ENTER_AMOUNT'
    })

    this.props.analyticsActions.trackEvent({
      key: Analytics.SWAP_CHECKOUT_SCREEN_BACK_CLICKED,
      properties: {}
    })
  }

  toggleExchangeTooltip = () => {
    this.setState((prevState) => ({
      isActiveExchangeToolTip: !prevState.isActiveExchangeToolTip
    }))

    this.props.analyticsActions.trackEvent({
      key: Analytics.SWAP_PRICE_TOOLTIP_CLICKED,
      properties: {}
    })
  }

  clearSubmitErrors() {
    this.props.formActions.clearSubmitErrors('previewSwap')
  }

  render() {
    if (!this.props.initSwapFormValues?.BASE || !this.props.initSwapFormValues?.COUNTER) {
      this.props.swapActions.setStep({ step: 'INIT_SWAP' })
      return null
    }

    const { BASE, COUNTER } = this.props.initSwapFormValues

    const { error } = this.props
    const baseCoinDisplaySymbol = window.coins[BASE.coin].coinfig.displaySymbol
    const counterCoinDisplaySymbol = window.coins[COUNTER.coin].coinfig.displaySymbol

    if (isNabuError(error)) {
      return <GenericNabuErrorFlyout error={error} onDismiss={this.clearSubmitErrors} />
    }

    return (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween={false} marginBottom>
            <Icon
              role='button'
              data-e2e='backToEnterAmount'
              name='arrow-back'
              cursor
              size='24px'
              color='grey600'
              onClick={this.handleOnClickBack}
            />{' '}
            <Text size='20px' color='grey900' weight={600} style={{ marginLeft: '24px' }}>
              <FormattedMessage id='copy.confirm_swap' defaultMessage='Confirm Swap' />
            </Text>
          </TopText>
        </FlyoutWrapper>

        <FromToLogoLeft
          accountType={BASE.type}
          amount={this.props.swapAmountFormValues?.cryptoAmount}
          base
          coinCode={BASE.coin}
          label={BASE.label}
        >
          <FormattedMessage id='copy.from' defaultMessage='From' />
        </FromToLogoLeft>

        {this.props.incomingAmountR.cata({
          Failure: (e) => e,
          Loading: () => (
            <Row>
              <SkeletonRectangle height='44px' width='400px' />
            </Row>
          ),
          NotAsked: () => (
            <Row>
              <SkeletonRectangle height='44px' width='400px' />
            </Row>
          ),
          Success: (value) => {
            return (
              <FromToLogoLeft
                accountType={COUNTER.type}
                amount={value.amt}
                base={false}
                coinCode={COUNTER.coin}
                label={COUNTER.label}
              >
                <FormattedMessage id='copy.to' defaultMessage='To' />
              </FromToLogoLeft>
            )
          }
        })}
        <StyledRow>
          <div>
            <Title>
              <ExchangeRateRow>
                <Text color='grey900' weight={500}>
                  <FormattedMessage
                    id='modals.simplebuy.confirm.rate'
                    defaultMessage='Exchange Rate'
                  />
                </Text>
                <IconWrapper>
                  <Icon
                    name='question-in-circle-filled'
                    size='16px'
                    color={this.state.isActiveExchangeToolTip ? 'blue600' : 'grey300'}
                    onClick={this.toggleExchangeTooltip}
                  />
                </IconWrapper>
              </ExchangeRateRow>
            </Title>
            <Value data-e2e='swapExchangeRate' style={{ marginTop: 0 }}>
              {this.props.quoteR.cata({
                Failure: () => (
                  <Text size='14px' color='red600'>
                    <FormattedMessage id='copy.oops' defaultMessage='Oops. Something went wrong.' />
                  </Text>
                ),
                Loading: () => <SkeletonRectangle height='18px' width='70px' />,
                NotAsked: () => <SkeletonRectangle height='18px' width='70px' />,
                Success: (val) => (
                  <Text weight={400} color='grey900'>
                    1 {baseCoinDisplaySymbol} = {formatCoin(val.rate)} {counterCoinDisplaySymbol}
                  </Text>
                )
              })}
            </Value>
          </div>
          {this.state.isActiveExchangeToolTip && (
            <ToolTipText>
              <Text size='12px'>
                <TextGroup inline>
                  <FormattedMessage
                    id='copy.swap_exchange_rate_tt_1'
                    defaultMessage='The exchange rate is the best price available for'
                  />{' '}
                  {counterCoinDisplaySymbol}{' '}
                  <FormattedMessage
                    id='copy.swap_exchange_rate_tt_2'
                    defaultMessage='in terms of 1'
                  />{' '}
                  {baseCoinDisplaySymbol}{' '}
                  <Link
                    href='https://support.blockchain.com/hc/en-us/articles/360061672651'
                    size='12px'
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    <FormattedMessage
                      id='modals.simplebuy.summary.learn_more'
                      defaultMessage='Learn more'
                    />
                  </Link>
                </TextGroup>
              </Text>
            </ToolTipText>
          )}
        </StyledRow>
        <Row style={{ borderTop: '0' }}>
          <FeeBreakdownBox
            counter={COUNTER}
            counterQuote={this.props.quoteR}
            base={BASE}
            basePayment={this.props.paymentR}
          />
          <TextGroup inline style={{ marginTop: '16px', textAlign: 'center' }}>
            <Text size='12px' weight={500} color='grey600'>
              <FormattedMessage
                id='copy.swap_amount_change_disclaimer'
                defaultMessage='Final amount may change due to market activity. By approving this Swap you agree to Blockchain.com’s'
              />
            </Text>
            <Text size='12px' weight={500} color='grey600'>
              <Link
                href='https://support.blockchain.com/hc/en-us/articles/4417063009172'
                size='12px'
                rel='noopener noreferrer'
                target='_blank'
              >
                <FormattedMessage id='copy.refund_policy' defaultMessage='Refund Policy' />.
              </Link>
            </Text>
          </TextGroup>
        </Row>
        <FlyoutWrapper>
          <Form onSubmit={this.handleSubmit}>
            <Button
              nature='primary'
              data-e2e='swapBtn'
              type='submit'
              disabled={this.props.submitting}
              fullwidth
              height='48px'
            >
              {this.props.submitting ? (
                <HeartbeatLoader height='16px' width='16px' color='white' />
              ) : (
                <FormattedMessage id='buttons.swap_now' defaultMessage='Swap Now' />
              )}
            </Button>
            {this.props.error && (
              <ErrorCartridge style={{ marginTop: '16px' }} data-e2e='checkoutError'>
                <Icon name='alert-filled' color='red600' style={{ marginRight: '4px' }} />
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
  incomingAmountR: selectors.components.swap.getIncomingAmount(state),
  initSwapFormValues: selectors.form.getFormValues('initSwap')(state) as InitSwapFormValuesType,
  paymentR: selectors.components.swap.getPayment(state),
  quoteR: selectors.components.swap.getQuote(state),
  swapAmountFormValues: selectors.form.getFormValues('swapAmount')(state) as SwapAmountFormValues
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, Props>({ destroyOnUnmount: false, form: 'previewSwap' }),
  connector
)

type State = { isActiveExchangeToolTip: boolean }
type OwnProps = BaseProps & SuccessStateType & { handleClose: () => void }
export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(PreviewSwap) as React.ComponentClass<OwnProps>
