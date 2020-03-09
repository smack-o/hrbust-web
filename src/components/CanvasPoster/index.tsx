import React, { PureComponent } from 'react'
import html2canvas from 'html2canvas'
import ReactDOM from 'react-dom'

import './style.less'

type PropsType = {
}
type StateType = {
}

export default class CanvasPoster extends PureComponent<PropsType, StateType> {
  canvas: any

  constructor(props: PropsType) {
    super(props)
    this.state = {
      show: false,
    }
  }

  onClick = () => {
    console.log('click')
  }

  show = () => {
    const dom = document.querySelector('.canvas-poster-wrapper')?.children[0]

    return html2canvas(dom).then((canvas: any) => {
      this.canvas = canvas
      const url = this.showImg()
      return url
    })
  }

  showImg = () => {
    return this.canvas.toDataURL()
  }

  render() {
    const { children } = this.props
    console.log(children)
    return <div onClick={this.onClick} className="canvas-poster-wrapper">
      {children}
    </div>
  }
}
