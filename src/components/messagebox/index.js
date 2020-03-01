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
import './styles.scss'
import Timeline from '../timeline'

const debug = console.log

class MessageBox extends React.Component
{
  /// @param: props: { room: Room, matrix: MatrixClient }
  constructor(props)
  {
    super(props)

    this.state = {
      messageToSend: '',
    }
    
    this.onChange = this.onChange.bind(this)
    this.sendOnEnter = this.sendOnEnter.bind(this)
    this.sendMessage = this.sendMessage.bind(this)

    this.timeline = React.createRef()
  }

  onChange(e)
  {
    e.preventDefault()

    this.setState({ [e.target.name]: e.target.value })
  }

  sendOnEnter(e)
  {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.sendMessage()
    }
  }

  sendMessage()
  {
    const { matrix, room } = this.props

    const content = {
      body: this.state.messageToSend,
      msgtype: 'm.text',
    }

    matrix.sendEvent(room.roomId,
                     'm.room.message',
                     content)
    this.setState({ messageToSend: '' })

    this.timeline.current.notifyUpdate()
  }

  render()
  {
    const { matrix, room } = this.props
    
    if (!room) { return [] }
    
    return (
      <div className='messagebox'>
        <div>{ room.name }</div>
        <div className='messagebox__timeline'>
          <Timeline ref={ this.timeline }
                    matrix={ matrix }
                    timelineSet={ room.getUnfilteredTimelineSet() }
                    room={ room } />
        </div>
        <div>
          <input type='text'
                 name='messageToSend'
                 onChange={ this.onChange }
                 onKeyUp={ this.sendOnEnter }
                 value={ this.state.messageToSend } />
          <button onClick={ this.sendMessage }>Send</button>
        </div>
      </div>);
  }
}

export default MessageBox
