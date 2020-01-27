import { CoinType, RemoteDataType } from 'core/types'
import { connect } from 'react-redux'
import { Field } from 'redux-form'
import { getData } from './selectors'
import { RatesType } from 'data/types'
import { RootState } from 'data/rootReducer'
import { Text } from 'blockchain-info-components'
import React, { Component } from 'react'
import SelectBox from 'components/Form/SelectBox'

export type OwnProps = {
  coin: CoinType
  rates: RatesType
}

type SuccessStateType = {
  elements: Array<any>
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & LinkStatePropsType

export class BorrowCoinDropdown extends Component<Props> {
  state = {}

  renderElements = values => {
    return [
      {
        group: '',
        items: values.map(value => ({
          text: value.label,
          value
        }))
      }
    ]
  }

  render () {
    return this.props.data.cata({
      Success: values => {
        return (
          <Field
            component={SelectBox}
            elements={this.renderElements(values)}
            searchEnabled={false}
            includeAll={false}
            name='collateral'
          />
        )
      },
      Failure: e => <Text>{typeof e === 'string' ? e : e.message}</Text>,
      Loading: () => <Text size='24px'>...</Text>,
      NotAsked: () => <Text size='24px'>...</Text>
    })
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps?: OwnProps
): LinkStatePropsType => ({
  data: getData(state, ownProps)
})

export default connect<LinkStatePropsType, any, OwnProps>(mapStateToProps)(
  BorrowCoinDropdown
)
