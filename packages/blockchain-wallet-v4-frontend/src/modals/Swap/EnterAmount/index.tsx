import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { Props as BaseProps } from '..'
import { ExtractSuccess } from 'core/types'
import { FlyoutWrapper } from 'components/Flyout'
import { formatCoin } from 'core/exchange/currency'
import { InitSwapFormValuesType } from 'data/types'
import { Option, TopText } from '../components'
import { selectors } from 'data'

import { getData } from './selectors'
import Checkout from './Checkout'
import Loading from './template.loading'

const SubTopText = styled.div`
  display: flex;
  align-items: center;
`

class EnterAmount extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.swapActions.initAmountForm()
    this.props.swapActions.startPollQuote()
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.swapActions.setStep({ step: 'PREVIEW_SWAP' })
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
          <TopText spaceBetween>
            <SubTopText>
              <Icon
                role='button'
                name='arrow-left'
                cursor
                size='24px'
                color='grey600'
                onClick={() =>
                  this.props.swapActions.setStep({
                    step: 'INIT_SWAP'
                  })
                }
              />{' '}
              <Text
                size='20px'
                color='grey900'
                weight={600}
                style={{ marginLeft: '16px' }}
              >
                <FormattedMessage
                  id='copy.new_swap'
                  defaultMessage='New Swap'
                />
              </Text>
            </SubTopText>
            {this.props.quoteR.cata({
              Success: val => (
                <Text size='14px' color='grey900' weight={500}>
                  1 {BASE.coin} = {formatCoin(val.rate)} {COUNTER.coin}
                </Text>
              ),
              Failure: () => (
                <Text size='14px' color='red600'>
                  <FormattedMessage
                    id='copy.oops'
                    defaultMessage='Oops. Something went wrong.'
                  />
                </Text>
              ),
              Loading: () => (
                <SpinningLoader borderWidth='4px' height='14px' width='14px' />
              ),
              NotAsked: () => (
                <SpinningLoader borderWidth='4px' height='14px' width='14px' />
              )
            })}
          </TopText>
        </FlyoutWrapper>
        <div>
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
            {JSON.stringify(this.props.initSwapFormValues.BASE)}
          </Option>
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
            {JSON.stringify(this.props.initSwapFormValues.COUNTER)}
          </Option>
          {this.props.data.cata({
            Success: val => <Checkout {...val} {...this.props} />,
            Failure: () => <>oops</>,
            Loading: () => <Loading />,
            NotAsked: () => <Loading />
          })}
        </div>
      </>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    data: getData(state),
    initSwapFormValues: selectors.form.getFormValues('initSwap')(
      state
    ) as InitSwapFormValuesType,
    quoteR: selectors.components.swap.getQuote(state)
  }
}

const connector = connect(mapStateToProps)

type OwnProps = BaseProps & { handleClose: () => void }
export type Props = OwnProps & ConnectedProps<typeof connector>
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>

// @ts-ignore
export default connector(EnterAmount)
