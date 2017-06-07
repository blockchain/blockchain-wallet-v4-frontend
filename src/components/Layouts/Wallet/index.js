import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { Route, Redirect } from 'react-router-dom'

import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'

const WalletLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
    // rest.isAuthenticated
    // ? (
      <div className='container-fluid height-100'>
        <div className='row'>
          <div className='col-md-12'>
            <Header />
          </div>
        </div>
        <div className='row height-100'>
          <div className='col-md-2 bg-grey'>
            <MenuLeft />
          </div>
          <div className='col-md-10 bg-grey'>
            <div className='row'>
              <div className='col-md-12'>
                <MenuTop />
              </div>
            </div>
            <div className='row'>
              <div className='col-md-12'>
                <Component {...matchProps} />
              </div>
            </div>
          </div>
        </div>
      </div>
      // )
      // : (
      //   <Redirect to={{ pathname: '/login', state: { from: matchProps.location } }} />
      // )
    )} />
  )
}

function mapStateToProps (state) {
  return {
    isAuthenticated: state.applicationState.auth.isAuthenticated
  }
}

export default connect(mapStateToProps)(WalletLayout)
