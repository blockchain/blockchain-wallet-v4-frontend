import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import Alerts from 'components/Shared/Alerts'

const PublicLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className='container-fluid h-100 bg-primary'>
        <Alerts />
        <div className='row h-25 align-items-start'>
          <div className='col'>
            <Header />
          </div>
        </div>
        <div className='row h-50 justify-content-center align-items-center'>
          <div className='col-12 col-md-4'>
            <Component {...matchProps} />
          </div>
        </div>
        <div className='row h-25 align-items-end'>
          <div className='col'>
            <Footer />
          </div>
        </div>
      </div>
    )} />
  )
}

export default PublicLayout
