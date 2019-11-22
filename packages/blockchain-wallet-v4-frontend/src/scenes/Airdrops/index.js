import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import Loading from './template.loading'
import React from 'react'
import styled from 'styled-components'
import Success from './template.success'

export const Wrapper = styled.div`
  width: 100%;
  margin: 12px 30px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme['grey000']};
`
export const Header = styled.div`
  margin-bottom: 40px;
`

class Airdrops extends React.PureComponent {
  render () {
    const { data } = this.props
    const Templates = data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Failure: () => (
        <Text>Oops. Something went wrong and we don't know why</Text>
      )
    })
    return (
      <Wrapper>
        <Header>
          <Text size='32px' color='grey800' weight={600}>
            <FormattedMessage
              id='scenes.airdrops.blockchain'
              defaultMessage='Blockchain Airdrops'
            />
          </Text>
          <Text size='16px' color='grey400' weight={500}>
            <FormattedMessage
              id='scenes.airdrops.blockchain.safest'
              defaultMessage='The safest and easiest way to automatically try and discover new crypto'
            />
          </Text>
        </Header>
        {Templates}
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  data: selectors.modules.profile.getUserData(state)
})

const mapDispatchToProps = dispatch => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Airdrops)
