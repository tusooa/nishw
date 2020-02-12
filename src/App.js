import React from 'react';
import logo from './logo.svg';
import './App.css';
import config from './config.json'

class App extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      username: '',
      homeserver: config.defaultHomeServer,
      password: '',
      loggedIn: false,
      message: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }
  
  handleChange(event)
  {
    event.preventDefault();

    this.setState({ [event.target.name]: event.target.value });
  }

  logIn()
  {
    const { username, password } = this.state;

    if (username === 'user' && password === 'pass') {
      this.setState({loggedIn: true, message: 'Log-in successful.'});
    } else {
      this.setState({message: "Password is wrong"});
    }
  }

  logOut()
  {
    this.setState({loggedIn: false, message: ''});
  }
  
  render()
  {
    return (
      <div className="App">
        {
          (!this.state.loggedIn) ? (
            <div>
              <p>Username: <input type="text" name="username"
                                  onChange={this.handleChange} value={this.state.username} />
                @ <input type="text" name="homeserver"
                         onChange={this.handleChange} value={this.state.homeserver} /></p>
              <p>Password: <input type="password" name="password"
                                  onChange={this.handleChange} value={this.state.password} /></p>
              <button onClick={this.logIn}>Log in</button>
            </div>
          ) : (
            <div>
              <button onClick={this.logOut}>Log out</button>
            </div>
          )
        }
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default App;
