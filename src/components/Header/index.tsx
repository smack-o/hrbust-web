import React, { PureComponent } from 'react'
import './style.less'

type PropsType = {
    title: string,
    subtitle?: string,
}
type StateType = {
    show: boolean
}

export default class Header extends PureComponent<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = {
      show: false,
    }
  }

    onClick = () => {
      console.log('click')
    }

    render() {
      const { show } = this.state
      const { title, subtitle } = this.props
      return <div onClick={this.onClick}>header {show && 'test'} {title} {subtitle}</div>
    }
}
