import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class RequestEtherContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    this.props.formActions.initialize('requestEther', this.props.initialValues)
  }

  componentWillReceiveProps (nextProps) {
    const { coin } = nextProps
    if (coin === 'BTC') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('RequestBitcoin')
    } else if (coin === 'BCH') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('RequestBch')
    }
  }

  onSubmit () {
    this.props.modalActions.closeAllModals()
  }

  render () {
    const { data, closeAll, selection, coins } = this.props

    return data.cata({
      Success: (val) => <Success
        {...this.props}
        address={val}
        closeAll={closeAll}
        coins={coins}
        selection={selection}
        onSubmit={this.onSubmit}
      />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    coin: 'ETH'
  },
  data: getData(state),
  coin: formValueSelector('requestEther')(state, 'coin')
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('RequestEther')
)

export default enhance(RequestEtherContainer)
