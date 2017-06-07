import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'

const PublicLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className='container-fluid bg-blue'>
        <div className='row'>
          <div className='col-md-12'>
            <Header />
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12 flex-justify'>
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

export default PublicLayout
