import React from 'react'
import { Route } from 'react-router-dom'
import './style.scss'

const PublicLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className='public'>
        <Component {...matchProps} />
      </div>
    )} />
  )
}

export default PublicLayout
