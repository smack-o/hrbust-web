import React from 'react'
import { Route, Switch } from 'react-router-dom'
import getComponent from '@/utils/loadable'


export default function router() {
  return <Switch>
    <Route exact path="/" render={getComponent('containers/Home')} />
    <Route path="/query/ticket" render={getComponent('containers/QueryCetTicket')} />
    <Route path="/query/cet" render={getComponent('containers/QueryCet')} />
    <Route path="*" render={getComponent('containers/Page404')} />
    {/* <Route exact path="/about" component={getComponent('containers/About')} /> */}
    {/* <Route path="/music" component={MusicFestival} /> */}
  </Switch>
}
