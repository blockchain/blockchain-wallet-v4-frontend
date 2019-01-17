import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { actions } from 'data'
import { FlatLoader } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 30px;
  width: 100%;
`
class LockboxContainer extends React.PureComponent {
  componentDidMount () {
    this.props.lockboxActions.determineLockboxRoute()
  }

  render () {
    return (
      <Wrapper>
        <FlatLoader width='150px' height='20px' />
      </Wrapper>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(LockboxContainer)
