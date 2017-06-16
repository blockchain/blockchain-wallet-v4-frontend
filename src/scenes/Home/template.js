import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

import ActivityList from './ActivityList'
import BalanceSummary from './BalanceSummary'
import DidYouKnow from './DidYouKnow'

const Home = (props) => {
  return (
    <section className='container-fluid'>
      <div className='row padding-20'>
        <div className='col-12 col-lg-6'>
          <ActivityList activities={props.activities} />
        </div>
        <div className='col-12 col-lg-6'>
          <BalanceSummary />
          <DidYouKnow />
        </div>
      </div>
    </section>
  )
}

export default CSSModules(Home, style)
