import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

import ActivityList from './ActivityList'
import BalanceSummary from './BalanceSummary'
import DidYouKnow from './DidYouKnow'

const Home = (props) => {
  return (
    <section>
      <ActivityList activities={props.activities} />
      <BalanceSummary />
      <DidYouKnow />
    </section>
  )
}

export default CSSModules(Home, style)
