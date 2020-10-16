import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { Form, InjectedFormProps, reduxForm } from 'redux-form'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import { Props as BaseProps } from '..'
import { Button } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { InitSwapFormValuesType, SwapAmountFormValues } from 'data/types'

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
      <FlyoutWrapper>
        <Form onSubmit={this.handleSubmit}>
          <Button data-e2e='swapBtn' type='submit'>
            <FormattedMessage
              id='buttons.swap_x_for_y'
              defaultMessage='Swap {base} for {counter}'
              values={{ base: BASE.coin, counter: COUNTER.coin }}
            />
          </Button>
        </Form>
      </FlyoutWrapper>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  initSwapFormValues: selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType,
  swapAmountFormValues: selectors.form.getFormValues('swapAmount')(
    state
  ) as SwapAmountFormValues
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
