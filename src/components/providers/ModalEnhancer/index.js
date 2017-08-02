import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'

const enhance = connect(
  (state) => ({
    modals: selectors.modals.getModals(state)
  }),
  (dispatch) => ({
    close: compose(dispatch, actions.modals.closeModal)
  })
)

export default (type) => (Component) => enhance(
  class Modal extends PureComponent {
    render () {
      let { modals, ...props } = this.props
      let filtered = modals.filter(m => m.type === type)
      return filtered.length ? (
        <div>
          {filtered.map((modal, i) => (
            <Component
              key={`${type}:${i}`}
              position={modals.indexOf(modal)}
              {...modal.props} {...props} />
          ))}
        </div>
      ) : null
    }
  }
)
