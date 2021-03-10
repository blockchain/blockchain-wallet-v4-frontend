import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Template from './template'

class WalletLanguageContainer extends React.PureComponent {
  render() {
    const { data } = this.props

    return <Template language={data.locale} />
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(WalletLanguageContainer)
