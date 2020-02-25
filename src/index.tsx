import React, { ComponentClass } from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './containers/App/index'
import '@/utils/flexible'
import '@/assets/global.less'

function renderApp(App: ComponentClass) {
  renderWithHotReload(App)
  if (module.hot) {
    module.hot.accept('@/router', () => {
      const NextApp = require('@/router').default
      renderWithHotReload(NextApp)
    })
  }
}

function renderWithHotReload(RootElement: ComponentClass) {
  ReactDOM.render(
    <AppContainer>
      <Router>
        <RootElement />
      </Router>
    </AppContainer>,
    document.getElementById('app'),
  )
}

renderApp(App)

