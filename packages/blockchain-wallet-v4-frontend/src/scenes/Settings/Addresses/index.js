import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { actions } from 'data'

import Menu from './Menu'

const Wrapper = styled.div`
  width: 100%;
`

class AddressesContainer extends React.Component {
  componentWillMount () {
    this.props.formActions.initialize('addresses', { status: 'bitcoin' })
  }

  render () {
    return (
      <Wrapper>
        <Menu />
      </Wrapper>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = connect(undefined, mapDispatchToProps)

export default enhance(AddressesContainer)
