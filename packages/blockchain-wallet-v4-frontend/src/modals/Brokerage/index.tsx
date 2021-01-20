import { compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { BrokerageStepType } from 'data/types'
import { ModalPropsType } from '../types'
import { selectors } from 'data'
import BankDetails from './BankLink/BankDetails'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import ModalEnhancer from 'providers/ModalEnhancer'
import RemoveBank from './BankLink/RemoveBank'

class Brokerage extends PureComponent<Props> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.step === prevProps.step) return
    if (
      BrokerageStepType[this.props.step] > BrokerageStepType[prevProps.step]
    ) {
      /* eslint-disable */
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
      /* eslint-enable */
    }
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render () {
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        in={this.state.show}
        direction={this.state.direction}
        data-e2e='brokerageModal'
      >
        {this.props.step === BrokerageStepType.REMOVE_BANK && (
          <FlyoutChild>
            <RemoveBank {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === BrokerageStepType.SHOW_BANK && (
          <FlyoutChild>
            <BankDetails {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.brokerage.getStep(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer('BROKERAGE_MODAL', { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  step: BrokerageStepType
}

export type Props = OwnProps &
  LinkStatePropsType &
  ConnectedProps<typeof connector>

type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(Brokerage)
