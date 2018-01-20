import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { actions } from 'data'

import Menu from './Menu'
import Bitcoin from './Bitcoin'
import BitcoinCash from './BitcoinCash'

const Wrapper = styled.div`
  width: 100%;
`

class AddressesContainer extends React.Component {
  componentWillMount () {
    this.props.formActions.initialize('addresses', { status: 'bitcoin' })
  }

  render () {
    let coin
    const { status } = this.props
    if (status === 'bitcoin') coin = <Bitcoin />
    else coin = <BitcoinCash />

    return (
      <Wrapper>
        <Menu />
        {coin}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  status: state.form.addresses && state.form.addresses.values.status
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = connect(mapStateToProps, mapDispatchToProps)

export default enhance(AddressesContainer)
