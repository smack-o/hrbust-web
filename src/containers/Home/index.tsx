import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import './style.less'

type PropsType = {} & RouteComponentProps
type StateType = {}

@withRouter
export default class Home extends React.Component<PropsType, StateType> {
  jump() {
    this.props.history.push('/about')
  }
  render() {
    return <div>

            home page
      <button onClick={this.jump.bind(this)}>button</button>
    </div>
  }
}
