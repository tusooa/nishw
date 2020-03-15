/*
 *  Copyright (C) 2020 Tusooa Zhu
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react'
import './App.css'
import config from './config.json'

import Login from './components/login'
import MainPage from './components/mainpage'
import { withCookies } from 'react-cookie'
global.Olm = require('olm/olm_legacy') // FIXME
const sdk = require('matrix-js-sdk')

class App extends React.Component
{
  constructor(props)
  {
    super(props)

    this.state = {
      userId: props.cookies.get('userId') || '',
      homeserver: props.cookies.get('homeserver') || config.homeserver,
      accessToken: props.cookies.get('accessToken') || '',
      deviceId: props.cookies.get('deviceId') || '',
    }
    this.state.loggedIn = !!this.state.accessToken

    if (! this.state.loggedIn) {
      this.matrix = null
    } else {
      this.initMatrix()
      this.startMatrix()
    }

    this.logIn = this.logIn.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  initMatrix()
  {
    this.matrix = sdk.createClient({
      baseUrl: this.state.homeserver,
      accessToken: this.state.accessToken,
      userId: this.state.userId,
      deviceId: this.state.deviceId,
      sessionStore: new sdk.WebStorageSessionStore(window.localStorage),
      cryptoStore: new sdk.MemoryCryptoStore(),
    })

    this.initCryptoPromise = this.matrix.initCrypto()
  }

  async startMatrix()
  {
    await this.initCryptoPromise
    await this.matrix.startClient({
      initialSyncLimit: 10,
      pendingEventOrdering: 'detached',
    })
  }

  /**
   * logIn({ username, password, homeserver })
   */
  logIn(authInfo)
  {
    const { username, password, homeserver } = authInfo;

    const matrix = sdk.createClient({
      baseUrl: homeserver,
      sessionStore: new sdk.WebStorageSessionStore(window.localStorage),
    })

    matrix.login('m.login.password',
                      {
                        identifier: {
                          type: 'm.id.user',
                          user: username,
                        },
                        password,
                        initial_device_display_name: 'nishw',
                      })
      .then((res) => {
        this.props.cookies.set('accessToken', res.access_token)
        this.props.cookies.set('homeserver', homeserver)
        this.props.cookies.set('userId', res.user_id)
        this.props.cookies.set('deviceId', res.device_id)

        this.setState({
          homeserver,
          accessToken: res.access_token,
          userId: res.user_id,
          deviceId: res.device_id,
        }, () => {
          this.initMatrix()
          this.setState({ loggedIn: true })
          this.startMatrix()
        })
      }, (err) => {
        this.setState({
          message: `${err.errcode}: ${err.message}`
        })
        console.log(err)
      })
  }

  logOut()
  {
    this.setState({
      loggedIn: false,
      message: '',
      userId: '',
      homeserver: '',
      accessToken: '',
      deviceId: '',
    })

    ;['userId', 'homeserver', 'accessToken', 'deviceId']
      .map( n => this.props.cookies.remove(n))

    this.matrix = null
  }

  render()
  {
    return (
      <div className="App">
        {
          (!this.state.loggedIn) ? (
            <div>
              <Login loginCallback={this.logIn} config={config}/ >
              <div id="nw-main-messagebox">
                { this.state.message }
              </div>
            </div>
          ) : (
            <MainPage matrix={this.matrix} logoutCallback={this.logOut} />
          )
        }
      </div>
    )
  }
}

export default withCookies(App)
