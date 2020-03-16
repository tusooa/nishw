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
import ch from '../../helpers/client'
import { i18n } from '../../helpers/i18n'

const debug = console.log

class MessageBox extends React.Component
{
  /// @param: props: { room: Room }
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
    const { room } = this.props
    const matrix = ch.get()

    matrix.sendTextMessage(room.roomId, this.state.messageToSend)
    this.setState({ messageToSend: '' })

    this.timeline.current.notifyUpdate()
  }

  render()
  {
    const { room } = this.props
    const matrix = ch.get()

    if (!room) { return [] }

    return (
      <div className='nw-messagebox'>
        <div>{ room.name }</div>
        <Timeline ref={ this.timeline }
                  timelineSet={ room.getUnfilteredTimelineSet() }
                  room={ room } />

        <div className='nw-messagebox--inputline'>
          <textarea className='nw-messagebox--input'
                 type='text'
                 name='messageToSend'
                 onChange={ this.onChange }
                 onKeyUp={ this.sendOnEnter }
                 value={ this.state.messageToSend } />
          <button onClick={ this.sendMessage }
                  className='nw-messagebox--sendbutton'>
            { i18n('Send') }
          </button>
        </div>
      </div>);
  }
}

export default MessageBox
