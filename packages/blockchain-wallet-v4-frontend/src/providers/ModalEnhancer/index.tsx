import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { equals } from 'ramda'
import { compose } from 'redux'

import { BSOrderType, BSPaymentTypes } from '@core/types'
import { actions, selectors } from 'data'
import { BuySellStepType, ModalNameType, ModalType } from 'data/types'

const mapDispatchToProps = (dispatch): LinkDispatchPropsType => ({
  cancelBSOrder: compose(dispatch, actions.components.buySell.cancelOrder),
  close: compose(dispatch, actions.modals.closeModal),
  closeAll: compose(dispatch, actions.modals.closeAllModals),
  update: compose(dispatch, actions.modals.updateModalOptions)
})

const mapStateToProps = (state): LinkStatePropsType => ({
  buySellOrder: selectors.components.buySell.getBSOrder(state),
  buySellStep: selectors.components.buySell.getStep(state),
  modals: selectors.modals.getModals(state)
})

const enhance = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  disableOutsideClose?: boolean
}
type LinkDispatchPropsType = {
  cancelBSOrder: (order: BSOrderType) => void
  close: (modalName?: ModalNameType) => void
  closeAll: () => void
  update: () => void
}
type LinkStatePropsType = {
  buySellOrder: BSOrderType | undefined
  buySellStep: keyof typeof BuySellStepType
  modals: Array<ModalType>
}

type OptionsType = {
  preventEscapeClose?: boolean
  transition?: number
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

export default (type: ModalNameType, options: OptionsType = {}) =>
  (Component) =>
    enhance(
      class Modal extends PureComponent<Props> {
        state = {}

        handleBuySellClose = () => {
          const { buySellOrder, buySellStep, cancelBSOrder } = this.props
          if (
            (buySellOrder?.paymentType === BSPaymentTypes.FUNDS ||
              buySellOrder?.paymentType === BSPaymentTypes.PAYMENT_CARD) &&
            buySellStep !== 'ORDER_SUMMARY'
          ) {
            cancelBSOrder(buySellOrder)
          }
        }

        handleClose = (modalName?: ModalNameType) => {
          if (options.transition) {
            this.handleBuySellClose()
            this.setState({ userClickedOutside: true })
            setTimeout(() => {
              this.props.close(modalName)
              this.setState({ userClickedOutside: false })
            }, options.transition)
          } else {
            this.props.close(modalName)
          }
        }

        handleClick = (e) => {
          // @ts-ignore
          // eslint-disable-next-line
          const modalContainer = ReactDOM.findDOMNode(this.node)
          if (
            modalContainer &&
            !this.props.disableOutsideClose &&
            // @ts-ignore
            equals(modalContainer.children[0], e.target)
          ) {
            this.handleClose()
          }
        }

        onKeyPressed = (evt) => {
          const event = evt || window.event
          if (event.keyCode === 27 && !options.preventEscapeClose) {
            this.handleClose()
          }
        }

        render() {
          const { modals, ...rest } = this.props
          const filtered = modals.filter((m) => m.type === type)
          const setRef = (node) => {
            if (node) {
              // @ts-ignore
              this.node = node
              node.focus()
            }
          }

          return filtered.length ? (
            <div>
              {filtered.map((modal, i) => (
                // eslint-disable-next-line
                <div
                  key={`${type}:${i}`} // eslint-disable-line
                  onKeyDown={this.onKeyPressed}
                  onMouseDown={this.handleClick}
                  ref={setRef}
                  tabIndex={0} // eslint-disable-line
                >
                  <Component
                    // @ts-ignore
                    ref={this.node}
                    position={modals.indexOf(modal) + 1}
                    total={modals.length}
                    {...this.state}
                    {...modal.options}
                    {...modal.props}
                    {...rest}
                    close={this.handleClose}
                  />
                </div>
              ))}
            </div>
          ) : null
        }
      }
    )
