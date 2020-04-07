import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import Footer from './template'
import React from 'react'

class FooterContainer extends React.PureComponent {
  render () {
    const { cryptoCurrency, simpleBuyActions } = this.props
    return (
      <Footer
        handleBuy={() =>
          simpleBuyActions.showModal('priceChart', cryptoCurrency)
        }
        {...this.props}
      />
    )
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FooterContainer)
