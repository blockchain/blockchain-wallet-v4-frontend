import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { equals } from 'ramda'
import { compose } from 'redux'

import { actions, selectors } from 'data'
import { ModalNameType, ModalType } from 'data/types'

const mapDispatchToProps = (dispatch): LinkDispatchPropsType => ({
  close: compose(dispatch, actions.modals.closeModal),
  closeAll: compose(dispatch, actions.modals.closeAllModals),
  update: compose(dispatch, actions.modals.updateModalOptions)
})

const mapStateToProps = (state): LinkStatePropsType => ({
  modals: selectors.modals.getModals(state)
})

const enhance = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  disableOutsideClose?: boolean
}
type LinkDispatchPropsType = {
  close: () => void
  closeAll: () => void
  update: () => void
}
type LinkStatePropsType = {
  modals: Array<ModalType>
}

type OptionsType = {
  preventEscapeClose?: boolean
  transition?: number
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

export default (type: ModalNameType, options: OptionsType = {}) => (Component) =>
  enhance(
    class Modal extends PureComponent<Props> {
      state = {}

      handleClose = () => {
        if (options.transition) {
          this.setState({ userClickedOutside: true })
          setTimeout(() => {
            this.props.close()
            this.setState({ userClickedOutside: false })
          }, options.transition)
        } else {
          this.props.close()
        }
      }

      handleClick = (e) => {
        // @ts-ignore
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
              <div
                key={`${type}:${i}`}
                onKeyDown={this.onKeyPressed}
                onMouseDown={this.handleClick}
                ref={setRef}
                tabIndex={0}
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
                />
              </div>
            ))}
          </div>
        ) : null
      }
    }
  )
