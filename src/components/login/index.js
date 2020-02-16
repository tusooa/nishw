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
