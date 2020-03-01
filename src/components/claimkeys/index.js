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

class ClaimKeys extends React.Component
{
  constructor(props)
  {
    super(props)

    this.state = {
      keyPassword: '',
      message: '',
    }

    this.handleChange = this.handleChange.bind(this)
    this.claimKeys = this.claimKeys.bind(this)
  }

  handleChange(e)
  {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
  }

  claimKeys()
  {
    const { matrix } = this.props
    matrix.getKeyBackupVersion()
      .then(backupInfo =>
            matrix.restoreKeyBackupWithPassword(
              this.state.keyPassword, undefined, undefined, backupInfo
            ))
      .catch(e => this.setState({ message: e }))
  }

  render()
  {
    const { matrix } = this.props

    return (
      <div>
        <input type='password'
               name='keyPassword'
               value={ this.state.keyPassword }
               onChange={ this.handleChange } />
        <button onClick={ this.claimKeys }>Claim Keys</button>
        <div>{ this.state.message }</div>
      </div>
    )
  }
}

export default ClaimKeys
