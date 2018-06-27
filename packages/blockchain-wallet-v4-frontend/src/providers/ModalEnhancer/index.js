import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import { equals } from 'ramda'

import { actions, selectors } from 'data'

const mapDispatchToProps = (dispatch) => ({
  close: compose(dispatch, actions.modals.closeModal),
  closeAll: compose(dispatch, actions.modals.closeAllModals),
  replace: compose(dispatch, actions.modals.replaceModal),
  update: compose(dispatch, actions.modals.updateModalOptions)
})

const mapStateToProps = (state) => ({
  modals: selectors.modals.getModals(state)
})

const enhance = connect(mapStateToProps, mapDispatchToProps)

export default (type) => (Component) => enhance(
  class Modal extends PureComponent {
    constructor (props) {
      super(props)
      this.handleClick = this.handleClick.bind(this)
      this.onKeyPressed = this.onKeyPressed.bind(this)
    }

    handleClick (e) {
      const modalContainer = ReactDOM.findDOMNode(this.node)
      if (modalContainer && equals(modalContainer.children[0], e.target)) {
        this.props.close()
      }
    }

    onKeyPressed (evt) {
      const event = evt || window.event
      if (event.keyCode === 27) {
        this.props.close()
      }
    }

    render () {
      const { modals, ...rest } = this.props
      const filtered = modals.filter(m => m.type === type)
      const setRef = (node) => {
        if (node) {
          this.node = node
          node.focus()
        }
      }

      return filtered.length ? (
        <div>
          {filtered.map((modal, i) => (
            <div key={`${type}:${i}`} onKeyDown={this.onKeyPressed}
              onMouseDown={this.handleClick} ref={setRef} tabIndex='0'>
              <Component ref={this.node}
                position={modals.indexOf(modal) + 1}
                total={modals.length}
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
