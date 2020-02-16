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
import React from 'react';
import './login.css';

class Login extends React.Component
{
  constructor(props)
  {
    super(props)

    this.state = {
      username: '',
      homeserver: props.config.defaultHomeServer,
      password: '',
    }

    this.loginCallback = props.loginCallback

    this.handleChange = this.handleChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleChange(event)
  {
    event.preventDefault()

    this.setState({ [event.target.name]: event.target.value })
  }

  handleLogin(event)
  {
    event.preventDefault()

    const { homeserver, username, password } = this.state

    this.loginCallback({ homeserver, username, password })
  }
  
  render()
  {
    return (<div className="nw-login-container">
              <div className="nw-login-form">
                <div className="nw-login-row">
                  <span className="nw-login-prompt">Homeserver: </span>
                  <input type="text" name="homeserver"
                         onChange={this.handleChange} value={this.state.homeserver} />
                </div>
                <div />
                <div className="nw-login-row">
                  <span className="nw-login-prompt">Username: </span>
                  <input type="text" name="username"
                         onChange={this.handleChange} value={this.state.username} />
                </div>
                <div />
                
                <div className="nw-login-row">
                  <span className="nw-login-prompt">Password: </span>
                  <input type="password" name="password"
                         onChange={this.handleChange} value={this.state.password} />
                </div>
                <div />
                <div className="nw-login-row">
                  <button onClick={this.handleLogin}>Log in</button>
                </div>
              </div>
            </div>)
  }
}

export default Login
