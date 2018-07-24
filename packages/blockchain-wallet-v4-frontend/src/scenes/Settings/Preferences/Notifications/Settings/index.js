
import React from 'react'
import { connect } from 'react-redux'
import { getData } from './selectors'
import Settings from './template.js'

class SettingContainer extends React.PureComponent {
  render () {
    const defaultData = { isEmailVerified: false, isMobileVerified: false }

    return this.props.data.cata({
      Success: value => <Settings data={value} />,
      Failure: message => <Settings data={defaultData} />,
      Loading: () => <Settings data={defaultData} />,
      NotAsked: () => <Settings data={defaultData} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps)(SettingContainer)
