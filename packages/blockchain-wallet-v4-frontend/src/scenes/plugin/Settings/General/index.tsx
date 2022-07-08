import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'

import Currency from './Currency'
import Language from './Language'
import { Overal } from './Overal'

export const General = (props) => {
  const { path } = props.match

  return (
    <>
      <Switch>
        <Route component={Overal} path={path} exact />
        <Route component={Currency} path={`${path}/local-currency`} />
        <Route component={Language} path={`${path}/language`} />
      </Switch>
    </>
  )
}
