import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { CoinfigType, CoinType } from '@core/types'
import { actions, selectors } from 'data'

import ExploreLayout from './template'

class ExploreLayoutContainer extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.coinsActions.fetchCoinsRates()
  }

  render() {
    const { component: Component, path, ...rest } = this.props

    return (
      <Route
        path={path}
        render={() => (
          <ExploreLayout>
            <Component computedMatch={rest.computedMatch} {...rest} />
          </ExploreLayout>
        )}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

const mapDispatchToProps = (dispatch) => ({
  coinsActions: bindActionCreators(actions.core.data.coins, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  coin?: CoinType
  coinfig?: CoinfigType
  component: React.ComponentType<any>
  computedMatch?: any
  exact?: boolean
  path: string
}

export default connector(ExploreLayoutContainer)
