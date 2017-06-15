import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'

const LandingLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className='container-fluid bg-blue'>
        <div className='row'>
          <div className='col'>
            <Header />  
          </div>
        </div>  
        <div className='row h-100 justify-content-center align-items-center'>
          <div className='col'>
            <Component {...matchProps} />
          </div>
        </div>
        <div className='row align-items-end'>
          <div className='col'>
            <Footer />
          </div>
        </div>  
      </div>
    )} />
  )
}

export default LandingLayout
