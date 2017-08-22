import React from 'react'
import { reduxForm } from 'redux-form'

const singleForm = (formName) => Component => {
  class SingleForm extends React.Component {
    render () {
      return <Component {...this.props} />
    }
  }

  return reduxForm({ form: formName, destroyOnUnmount: false })(SingleForm)
}

export default singleForm
