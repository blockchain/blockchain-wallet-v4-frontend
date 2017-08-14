import React from 'react'
import { Route } from 'react-router-dom'
import Layout from './template.js'

class LayoutContainer extends React.Component {
  render () {
    const { component: Component } = this.props

    return (
      <Route render={
        <Layout>
          <Component />
        </Layout>
      } />
    )
  }
}

export default LayoutContainer
