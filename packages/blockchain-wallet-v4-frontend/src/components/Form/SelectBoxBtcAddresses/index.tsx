import { AccountTypes, RemoteDataType, SupportedCoinsType } from 'core/types'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { SkeletonRectangle } from 'blockchain-info-components'
import React from 'react'
import SelectBoxBtc from './template'

class SelectBoxBtcAddresses extends React.PureComponent<Props> {
  render () {
    const { data, ...rest } = this.props
    return data.cata({
      Success: value => {
        return (
          <SelectBoxBtc options={value.data} elements={value.data} {...rest} />
        )
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <SkeletonRectangle height='48px' width='100%' />,
      NotAsked: () => <SkeletonRectangle height='48px' width='100%' />
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
  supportedCoins: SupportedCoinsType
}
type Props = LinkStatePropsType

export default connector(SelectBoxBtcAddresses)
