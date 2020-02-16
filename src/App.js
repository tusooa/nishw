import React from 'react'
import './App.css'
import config from './config.json'

import Login from './components/login'
import MainPage from './components/mainpage'
import sdk from 'matrix-js-sdk'

class App extends React.Component
{
  constructor(props)
  {
    super(props)

    this.state = {
      userId: '',
      homeserver: '',
      loggedIn: false,
      accessToken: '',
    }

    this.matrix = null
    
    this.logIn = this.logIn.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  /**
   * logIn({ username, password, homeserver })
   */
  logIn(authInfo)
  {
    const { username, password, homeserver } = authInfo;

    this.matrix = sdk.createClient(homeserver)

    this.matrix.login('m.login.password',
                      {
                        identifier: {
                          type: 'm.id.user',
                          user: username,
                        },
                        password,
                      })
      .then((res) => {
        console.log(res)

        this.matrix.startClient()

        this.setState({
          loggedIn: true,
          accessToken: res.access_token,
          homeserver: res.home_server,
          userId: res.user_id,
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
    this.setState({loggedIn: false, message: ''})
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
            <MainPage matrix={this.matrix} />
          )
        }
      </div>
    );
  }
}

export default App;
