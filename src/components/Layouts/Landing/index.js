import React from 'react'
import { Route } from 'react-router-dom'
import classNames from 'classnames'

import Header from './Header'
import Footer from './Footer'

import style from './style.scss'
import grid from 'sass/elements/grid.scss'

const LandingLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className={grid.containerFluid}>
        <div className={grid.row}>
          <div className={grid.colMd12}>
            <Header />
          </div>
        </div>
        <div className={grid.row}>
          <div className={grid.colMd12}>
            <Component {...matchProps} />
          </div>
        </div>
        <div className={grid.row}>
          <div className={grid.colMd12}>
            <Footer />
          </div>
        </div>
      </div>
    )} />
  )
}

export default LandingLayout
