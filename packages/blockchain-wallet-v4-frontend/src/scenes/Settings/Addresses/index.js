import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { TabMenuAddressesStatus } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
import { actions } from 'data'

import Bitcoin from './Bitcoin'

const Wrapper = styled.div`
  width: 100%;
`

const Menu = reduxForm({ form: 'addresses' })(HorizontalMenu)

class AddressesContainer extends React.Component {
  componentWillMount () {
    this.props.formActions.initialize('addresses', { status: 'bitcoin' })
  }

  render () {
    return (
      <Wrapper>
        <Menu>
          <Field name='status' component={TabMenuAddressesStatus} />
        </Menu>
        <Bitcoin />
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
