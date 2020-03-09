import React, { Fragment } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import request from '@/utils/request'
import { Toast, List, InputItem, Button } from 'antd-mobile'
import { getQuery, delay } from '@/utils'
import CanvasPoster from '@/components/CanvasPoster'

import './style.less'

type PropsType = {} & RouteComponentProps

type From = {
  id: string,
  name: string
  captcha: string,
}
type StateType = {
  // title: string,
  // provinces: any[],
  captcha: string,
  form: From,
  showGradeImg: string,
  grade: any,
  // showModal: boolean,
}

@withRouter
export default class QueryCet extends React.Component<PropsType, StateType> {
  cookie = ''
  canvasPoster: any

  constructor(props: PropsType) {
    super(props)

    const { name, id } = getQuery()

    this.state = {
      captcha: '',
      form: {
        id: id || '',
        name: name || '',
        captcha: '',
      },
      showGradeImg: '',
      grade: {
      },
    }
  }
  componentDidMount() {
  }

  setStateP = (data: any) => new Promise(resolve => this.setState(data, resolve))

  getCet = async (forceGetCaptcha = false) => {
    const { id, name, captcha } = this.state.form

    let msg
    if (!name) {
      msg = '请输入姓名'
    }
    if (!id) {
      msg = '请输入身份证号'
    }
    if (!forceGetCaptcha && (this.state.captcha && !captcha)) {
      msg = '请输入验证码'
    }

    if (msg) {
      Toast.info(msg, 1)
      return
    }

    const sendData: any = {
      id,
      name,
    }

    if (captcha && !forceGetCaptcha) {
      sendData.yzm = captcha
    }
    if (this.cookie) {
      sendData.cookie = this.cookie
    }

    const res = await request({
      url: '/api/cet',
      data: sendData,
    })

    if (res.success) {
      const {
        name,
        school,
        type,
        id,
        total,
        listen,
        reading,
        writing,
      } = res.data.data

      await this.setStateP({
        grade: {
          name,
          school,
          type,
          id,
          total,
          listen,
          reading,
          writing,
          time: `20${id.slice(6, 8)}年${+id.slice(8, 9) === 2 ? '12' : '2'}月`,
        },
      })

      // await delay(1500)
      const url = await this.canvasPoster.show()
      this.setState({
        showGradeImg: url,
      })

      return
    }

    if (+res.data.code === 80001) {
      const { cookie, base64 } = res.data
      this.cookie = cookie
      this.setState({
        captcha: base64,
      })
      return
    }

    Toast.info(res.message, 2)
  }

  onFormChange = (name: keyof From, value: any) => {
    const { form } = this.state
    if (name) {
      form[name] = value
      this.setState({
        form,
      })
    }
  }

  onClick = () => {
    this.getCet()
  }

  render() {
    const { captcha, form, showGradeImg, grade } = this.state


    return (
      <div className="query-cet-ticket">
        {
          !showGradeImg && <Fragment>
            <p className="title">四六级成绩查询</p>
            <List>
              <InputItem
                type="text"
                placeholder="输入姓名"
                clear
                onChange={(v) => { this.onFormChange('name', v) }}
                value={form.name}
              >姓名</InputItem>
              <InputItem
                type="text"
                placeholder="输入准考证号"
                clear
                onChange={(v) => { this.onFormChange('id', v) }}
                value={form.id}
              >准考证号</InputItem>
              {
                captcha && <InputItem
                  type="text"
                  placeholder="输入身验证码"
                  clear
                  onChange={(v) => { this.onFormChange('captcha', v) }}
                  extra={<img className="captcha" onClick={() => this.getCet(true)} src={captcha} />}
                  value={form.captcha}
                >验证码</InputItem>
              }
            </List>

            <Button className="button" type="primary" onClick={this.onClick}>查询四六级成绩</Button>

            <CanvasPoster ref={e => this.canvasPoster = e}>
              <div>
                <div className="wx-cet-wrap-detail">
                  <div className="wx-cet-line wx-cet-line-one"></div>
                  <div className="wx-cet-line"></div>
                  <div className="wx-cet-line"></div>
                  <div className="wx-cet-line"></div>
                  <div className="wx-cet-time">{grade.time}</div>
                  <div className="wx-cet-name"><span>{grade.type}</span><span>成绩单</span></div>
                  <div className="wx-cet-logo-wrap">
                    <div className="wx-cet-logo-detail"><span>CET</span></div>
                  </div>
                  <div className="wx-cet-info">姓名<span className="wx-cet-info-detail">{grade.name}</span></div>
                  <div className="wx-cet-info">学校<span className="wx-cet-info-detail">{grade.school}</span></div>
                  <div className="wx-cet-info">准考证号<span className="wx-cet-info-detail">{grade.id}</span></div>
                  <div className="wx-cet-result-wrap-B"><div className="wx-cet-result-list-B">听力<span className="wx-cet-list-detail-B">{grade.listen}</span></div>
                    <div className="wx-cet-result-list-B">阅读<span className="wx-cet-list-detail-B">{grade.reading}</span></div>
                    <div className="wx-cet-result-list-B">写作和翻译<span className="wx-cet-list-detail-B">{grade.writing}</span></div>
                    <div className="wx-cet-all">总分<span className="wx-cet-score">{grade.total}</span></div>
                  </div>
                  <div className="wx-cet-line wx-cet-line-one"></div>
                  <div className="wx-cet-line"></div>
                  <div className="wx-cet-line"></div>
                  <div className="wx-cet-line"></div>
                </div>
              </div>
            </CanvasPoster>
          </Fragment>
        }
        {
          showGradeImg && <Fragment>
            <p className="title">长按成绩单保存</p>
            <div className="grade-img">
              <img src={showGradeImg} />
            </div>
          </Fragment>
        }

      </div>
    )
  }
}
