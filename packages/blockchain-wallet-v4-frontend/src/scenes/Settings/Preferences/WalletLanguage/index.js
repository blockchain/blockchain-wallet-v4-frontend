import React from 'react'
import { connect } from 'react-redux'

import Template from './template'
import { getData } from './selectors'

class WalletLanguageContainer extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props

    return <Template {...rest} language={data.locale} />
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps)(WalletLanguageContainer)
