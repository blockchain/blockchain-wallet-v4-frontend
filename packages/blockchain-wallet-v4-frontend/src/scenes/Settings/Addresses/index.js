import React from 'react'
import Menu from './Menu'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { actions } from 'data'

import Bitcoin from './Bitcoin'
import Bch from './Bch'

const Wrapper = styled.div`
  width: 100%;
`

class AddressesContainer extends React.Component {
  componentWillMount () {
    this.props.formActions.initialize('addresses', { status: 'bitcoin' })
  }

  render () {
    const { status } = this.props
    return (
      <Wrapper>
        <Menu />
        {status === 'bitcoin'
          ? <Bitcoin />
          : <Bch />
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(AddressesContainer)
