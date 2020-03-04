import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import request from '@/utils/request'
import { Toast, List, InputItem, Button, Picker, Modal } from 'antd-mobile'
import ClipboardJS from 'clipboard'
import './style.less'

type PropsType = {} & RouteComponentProps

type From = {
  id: string,
  name: string
  captcha: string,
  provinceCode: string,
}
type StateType = {
  title: string,
  provinces: any[],
  captcha: string,
  form: From,
  showModal: boolean,
  uuid: string,
}

@withRouter
export default class CetTicket extends React.Component<PropsType, StateType> {
  state: StateType = {
    title: '',
    provinces: [],
    captcha: '',
    form: {
      id: '',
      name: '',
      captcha: '',
      provinceCode: '',
    },
    showModal: false,
    uuid: '',
  }
  cookie = ''

  componentDidMount() {
    this.getInfo()
    this.initContent()
  }

  initContent = () => {
    let clipboard = new ClipboardJS('.copy-button')
    console.log(clipboard)
    clipboard.on('success', e => {
      Toast.info('复制成功', 1)
      e.clearSelection()
    })
  }

  getInfo = async () => {
    const res = await request({
      url: '/api/cetv2/captcha',
      data: {
        cookie: this.cookie || '',
      },
    })

    if (res.success) {
      const { title, provinces, base64, cookie } = res.data.data
      console.log(title)
      this.cookie = cookie
      this.setState({
        title,
        provinces,
        captcha: base64,
        form: {
          ...this.state.form,
          // provinceCode: Object.keys(provinces)[0],
          provinceCode: this.state.form.provinceCode || '23',
        },
      })
    }
  }

  queryTicket = async () => {
    const { form: { id, name, provinceCode, captcha } } = this.state
    let msg
    if (!provinceCode) {
      msg = '请选择省份'
    }
    if (!name) {
      msg = '请输入姓名'
    }
    if (!id) {
      msg = '请输入身份证号'
    }
    if (!captcha) {
      msg = '请输入验证码'
    }

    if (msg) {
      Toast.info(msg, 1)
      return
    }

    const res = await request({
      url: '/api/cetv2/queryTicket',
      data: {
        id,
        name,
        provinceCode,
        yzm: captcha,
        cookie: this.cookie,
      },
    })

    if (!res.success) {
      Toast.info(res.data.data.Message, 1)
      this.onCaptchClick()
      return
    }

    this.setState({
      uuid: res.data.data.uuid,
      showModal: true,
    })
  }

  onFormChange = (name: keyof From, value: any) => {
    const { form } = this.state
    console.log(value)
    if (name) {
      form[name] = value
      this.setState({
        form,
      })
    }
  }

  onClick = () => {
    console.log(this.state.form)
    this.queryTicket()
  }

  onCaptchClick = () => {
    this.getInfo()
  }

  closeModal = () => {
    this.setState({
      showModal: false,
    })
  }

  goWxmp = () => { window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUwOTk3NTEzNg==#wechat_redirect' }

  copy = () => {

  }

  render() {
    const { title, provinces, captcha, form, showModal, uuid } = this.state

    return (
      <div className="query-cet-ticket">
        <p className="title">{title}</p>
        <List>
          <Picker
            title="选择地区"
            extra="请选择(可选)"
            data={Object.keys(provinces).map((key: any) => ({ label: provinces[key], value: key }))}
            value={[form.provinceCode]}
            // cascade={false}
            cols={1}
            onChange={v => this.onFormChange('provinceCode', v && v[0])}
          >
            <List.Item arrow="horizontal">选择所在省份</List.Item>

          </Picker>
          <InputItem
            type="text"
            placeholder="输入姓名"
            clear
            onChange={(v) => { this.onFormChange('name', v) }}
            value={form.name}
          >姓名</InputItem>
          <InputItem
            type="text"
            placeholder="输入身份证号"
            clear
            onChange={(v) => { this.onFormChange('id', v) }}
            value={form.id}
          >身份证号</InputItem>
          <InputItem
            type="text"
            placeholder="输入身验证码"
            clear
            onChange={(v) => { this.onFormChange('captcha', v) }}
            extra={captcha && <img onClick={this.onCaptchClick} className="captcha" src={captcha} />}
            value={form.captcha}
          >验证码</InputItem>
        </List>


        <Button className="button" type="primary" onClick={this.onClick}>查询准考证</Button>

        <Modal
          visible={showModal}
          transparent
          maskClosable={false}
          onClose={this.closeModal}
          title="查询成功"
          footer={[
            {
              text: '取消',
              onPress: this.closeModal,
            },
            {
              text: <button className="copy-button" data-clipboard-text={uuid}>点击复制</button>,
              onPress: this.copy,
            },
            {
              text: '去公众号查询',
              onPress: this.goWxmp,
            },
          ]}
          // wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <div style={{ height: 100, overflow: 'scroll' }}>
            <p className="no-select">复制并粘贴以下内容</p>
            <p className="no-select">发送至“理工喵”公众号获取准考证</p>
            <div className="uuid-wrapper">
              <span className="uuid">{uuid}</span>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
