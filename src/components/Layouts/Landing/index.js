import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'

const LandingLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className='bg-blue'>
        <Header />  
        <Component {...matchProps} />
        <Footer />
      </div>
    )} />
  )
}

export default LandingLayout
