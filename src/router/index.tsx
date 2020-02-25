import React from 'react'
import { Route, Switch } from 'react-router-dom'
import getComponent from '@/utils/loadable'


export default function router() {
  return <Switch>
    <Route exact path="/" render={getComponent('containers/Home')} />
    {/* <Route exact path="/about" component={getComponent('containers/About')} /> */}
    {/* <Route path="/music" component={MusicFestival} /> */}
  </Switch>
}
