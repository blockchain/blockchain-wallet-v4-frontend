import React from 'react'
import { connect } from 'react-redux'

import { SkeletonRectangle } from 'blockchain-info-components'
import { AccountTypes, RemoteDataType } from 'blockchain-wallet-v4/src/types'

import { getData } from './selectors'
import SelectBoxBtc from './template'

class SelectBoxBtcAddresses extends React.PureComponent<Props> {
  render() {
    const { data, ...rest } = this.props
    return data.cata({
      Failure: (message) => <div>{message}</div>,
      Loading: () => <SkeletonRectangle height='48px' width='100%' />,
      NotAsked: () => <SkeletonRectangle height='48px' width='100%' />,
      Success: (value) => {
        return <SelectBoxBtc options={value.data} elements={value.data} {...rest} />
      }
    })
  }
}

// @ts-ignore
SelectBoxBtcAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const connector = connect(mapStateToProps)

type LinkStatePropsType = {
  data: RemoteDataType<
    string,
    {
      data: Array<AccountTypes>
    }
  >
}
type Props = LinkStatePropsType

export default connector(SelectBoxBtcAddresses)
