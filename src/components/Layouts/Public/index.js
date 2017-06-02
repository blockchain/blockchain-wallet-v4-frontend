import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'

import style from './style.scss'

const PublicLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className={style.publicLayout}>
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

export default PublicLayout
