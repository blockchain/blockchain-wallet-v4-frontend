import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'

const enhance = connect(
  (state) => ({
    modals: selectors.modals.getModals(state)
  }),
  (dispatch) => ({
    close: compose(dispatch, actions.modals.closeAllModals)
  })
)

export default (type) => (Component) => enhance(
  class Modal extends PureComponent {
    render () {
      const { modals, ...props } = this.props
      const filtered = modals.filter(m => m.type === type)
      return filtered.length ? (
        <div>
          {filtered.map((modal, i) => (
            <Component
              key={`${type}:${i}`}
              position={modals.indexOf(modal) + 1}
              total={modals.length}
              {...modal.props}
              {...props}
            />
          ))}
        </div>
      ) : null
    }
  }
)
