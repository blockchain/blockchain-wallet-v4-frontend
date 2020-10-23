import React, { PureComponent } from 'react'

import { Props as BaseProps } from '..'
import { Button, Icon, Text } from 'blockchain-info-components'
import { coinToString } from 'core/exchange/currency'
import { CoinType, SwapOrderType } from 'core/types'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { TopText } from '../components'

class OrderDetails extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  state = {}

  render () {
    if (!this.props.order) return null

    const baseCoin = this.props.order.quote.pair.split('-')[0] as CoinType
    const counterCoin = this.props.order.quote.pair.split('-')[1] as CoinType

    return (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween marginBottom>
            <Text size='20px' color='grey900' weight={600}>
              <FormattedMessage
                id='copy.swap_details'
                defaultMessage='Swap Details'
              />
            </Text>
            <Icon
              role='button'
              name='close'
              cursor
              size='24px'
              color='grey600'
            />{' '}
          </TopText>
        </FlyoutWrapper>
        <Row>
          <Title>
            <FormattedMessage
              id='modals.exchangeresults.orderid'
              defaultMessage='Order ID'
            />
          </Title>
          <Value>{this.props.order.id}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='components.txlistitem.status'
              defaultMessage='Status'
            />
          </Title>
          <Value>{this.props.order.state}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='copy.swap' defaultMessage='Swap' />
          </Title>
          <Value>
            {coinToString({
              value: convertBaseToStandard(
                baseCoin,
                this.props.order.priceFunnel.inputMoney
              ),
              unit: { symbol: baseCoin }
            })}
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
          </Title>
          <Value>
            {coinToString({
              value: convertBaseToStandard(
                counterCoin,
                this.props.order.priceFunnel.outputMoney
              ),
              unit: { symbol: counterCoin }
            })}
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='copy.coin_network_fee'
              defaultMessage='{coin} Network Fee'
              values={{
                coin: baseCoin
              }}
            />
          </Title>
          <Value />
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='copy.coin_network_fee'
              defaultMessage='{coin} Network Fee'
              values={{
                coin: counterCoin
              }}
            />
          </Title>
          <Value />
        </Row>
        {this.props.order.state === 'PENDING_DEPOSIT' && (
          <FlyoutWrapper>
            <Form
              onSubmit={(e: any) => {
                e.preventDefault()
                this.props.swapActions.cancelOrder(this.props.order!.id)
              }}
            >
              <Button
                disabled={this.props.submitting}
                data-e2e='cancelOrder'
                type='submit'
                nature='warning'
                fullwidth
                jumbo
              >
                <FormattedMessage
                  id='buttons.cancel_order'
                  defaultMessage='Cancel Order'
                />
              </Button>
            </Form>
          </FlyoutWrapper>
        )}
      </>
    )
  }
}

type OwnProps = BaseProps & { handleClose: () => void; order?: SwapOrderType }
export type Props = OwnProps

export default reduxForm<{}, Props>({ form: 'swapOrderDetails' })(OrderDetails)
