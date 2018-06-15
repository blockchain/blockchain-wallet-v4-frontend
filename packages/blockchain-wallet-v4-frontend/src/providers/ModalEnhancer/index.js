import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
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
    render () {
      const { modals, ...rest } = this.props
      const filtered = modals.filter(m => m.type === type)

      return filtered.length ? (
        <div>
          {filtered.map((modal, i) => (
            <Component
              key={`${type}:${i}`}
              position={modals.indexOf(modal) + 1}
              total={modals.length}
              {...modal.options}
              {...modal.props}
              {...rest}
            />
          ))}
        </div>
      ) : null
    }
  }
)
