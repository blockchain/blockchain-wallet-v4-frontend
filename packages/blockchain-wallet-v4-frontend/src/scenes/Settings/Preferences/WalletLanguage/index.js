import React from 'react'
import { connect } from 'react-redux'

import Template from './template'
import { getData } from './selectors'

class WalletLanguageContainer extends React.PureComponent {
  render () {
    const { data } = this.props

    return <Template language={data.locale} />
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps)(WalletLanguageContainer)
