import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'

const LandingLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className='container-fluid align-items-stretch bg-blue'>
        <div className='row'>
          <div className='col-md-12'>
            <Header />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <Component {...matchProps} />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <Footer />
          </div>
        </div>
      </div>
    )} />
  )
}

export default LandingLayout
