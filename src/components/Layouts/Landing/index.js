import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'

import style from './style.scss'

const LandingLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className={style.landing}>
        <div className={style.header}>
          <Header />
        </div>
        <div className={style.content}>
          <Component {...matchProps} />
        </div>
        <div className={style.footer}>
          <Footer />
        </div>
      </div>
    )} />
  )
}

export default LandingLayout
