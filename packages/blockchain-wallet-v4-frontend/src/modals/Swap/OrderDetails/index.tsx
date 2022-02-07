import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'

import { coinToString } from '@core/exchange/utils'
import { SwapOrderType } from '@core/types'
import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getInput, getOutput } from 'data/components/swap/model'

import { Props as BaseProps, SuccessStateType } from '..'
import { TopText } from '../components'

class OrderDetails extends PureComponent<InjectedFormProps<{}, Props> & Props> {
  render() {
    if (!this.props.order) return null

    const baseCoin = getInput(this.props.order)
    const counterCoin = getOutput(this.props.order)
    const { handleClose, order } = this.props
    return (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween marginBottom>
            <Text size='20px' color='grey900' weight={600}>
              <FormattedMessage id='copy.swap_details' defaultMessage='Swap Details' />
            </Text>
            <Icon
              onClick={handleClose}
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
            <FormattedMessage id='modals.exchangeresults.orderid' defaultMessage='Order ID' />
          </Title>
          <Value>{order.id}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='components.txlistitem.status' defaultMessage='Status' />
          </Title>
          <Value>{order.state}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='copy.swap' defaultMessage='Swap' />
          </Title>
          <Value>
            {coinToString({
              unit: { symbol: baseCoin },
              value: convertBaseToStandard(baseCoin, order.priceFunnel.inputMoney)
            })}
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='buttons.receive' defaultMessage='Receive' />
          </Title>
          <Value>
            {coinToString({
              unit: { symbol: counterCoin },
              value: convertBaseToStandard(counterCoin, this.props.order.priceFunnel.outputMoney)
            })}
          </Value>
        </Row>
        {this.props.order.state === 'PENDING_DEPOSIT' && (
          <FlyoutWrapper>
            <Form
              onSubmit={(e: any) => {
                e.preventDefault()
                this.props.swapActions.cancelOrder({ id: order?.id ?? null })
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
                <FormattedMessage id='buttons.cancel_order' defaultMessage='Cancel Order' />
              </Button>
            </Form>
          </FlyoutWrapper>
        )}
      </>
    )
  }
}

type OwnProps = BaseProps & SuccessStateType & { handleClose: () => void; order?: SwapOrderType }
export type Props = OwnProps

export default reduxForm<{}, Props>({ form: 'swapOrderDetails' })(OrderDetails)
