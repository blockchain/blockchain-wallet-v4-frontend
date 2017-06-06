import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'

import style from './style.scss'
import grid from 'sass/elements/grid.scss'

const LandingLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className={grid.containerFluid}>
        <div className={grid.row}>
          <Header />
        </div>
        <div className={grid.row}>
          <div className={grid.colMd12}>
            <Component {...matchProps} />
          </div>
        </div>
        <div className={grid.row}>
          <Footer />
        </div>
      </div>
    )} />
  )
}

export default LandingLayout
