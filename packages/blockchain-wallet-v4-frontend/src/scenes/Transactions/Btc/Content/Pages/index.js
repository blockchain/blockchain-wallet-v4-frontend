import React from 'react'

import DataError from 'components/DataError'
import Loading from './template.loading'
import Success from './template.success'
import { checkForVulnerableAddressError } from 'services/ErrorService'
import VulnerableAddressError from 'components/VulnerableAddressError'

class Pages extends React.PureComponent {
  render () {
    const { data, buysellPartner } = this.props

    return data.cata({
      Success: value => (
        <Success transactions={value} buysellPartner={buysellPartner} />
      ),
      Failure: message => (
        message && checkForVulnerableAddressError(message)
          ? <VulnerableAddressError message={message} onArchive={this.props.onArchive} />
          : <DataError onClick={() => this.props.onRefresh()} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

export default Pages
