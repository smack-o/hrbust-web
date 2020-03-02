import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import './style.less'

type PropsType = {} & RouteComponentProps
type StateType = {}

@withRouter
export default class QueryCetTicket extends React.Component<PropsType, StateType> {
  jump() {
    this.props.history.push('/about')
  }
  render() {
    return <div>
      <button onClick={this.jump.bind(this)}>button</button>
    </div>
  }
}
