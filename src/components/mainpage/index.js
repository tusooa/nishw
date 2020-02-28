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

import RoomList from '../roomlist'
import MessageBox from '../messagebox'
import './styles.css'

class MainPage extends React.Component
{
  /**
   * <MainPage matrix=... logoutCallback=func />
   */
  constructor(props)
  {
    super(props)

    console.log(props)
    this.state = {
      rooms: [],
      timeline: [],
      currentRoom: null,
      message: '',
    }

    this.matrix = props.matrix

    this.matrix.on("Room.timeline",
                   (event, room, toStartOfTimeline) => {
                     if (event.getType() !== "m.room.message") {
                       return // only use messages
                     }
                     const timeline = this.state.timeline
                     timeline.push(event)
                     this.setState({ timeline })
                     console.log(event)
                     console.log(event.event.content.body)
                   })
    this.matrix.on('sync', (state) => {
      switch (state) {
      case 'ERROR':
        this.setState({ message: 'Connection to the server has been lost.' })
        break
      case "SYNCING":
        this.setState({ message: '' })
        break
      case "PREPARED":
        this.setState({ message: '', rooms: this.matrix.getRooms() })
        break
      }
    })

    this.switchRoom = this.switchRoom.bind(this)

  }

  componentDidMount()
  {
  }

  // @param room: Room
  switchRoom(room)
  {
    this.setState({ currentRoom: room })
  }
  
  render()
  {
    return (
      <div>
        <div className='header'>
          <button onClick={ this.props.logoutCallback }>Log out</button>
        </div>
        <div className='mainpage__content'>
          <div className='left'>
            <RoomList rooms={ this.state.rooms }
                      current={ this.state.currentRoom }
                      switchRoomCallback={ this.switchRoom } />
          </div>
          <div className='right'>
            <MessageBox room={ this.state.currentRoom }
                        matrix={ this.matrix }/>
          </div>
        </div>
        <div className='footer'>
          { this.state.message }
        </div>
      </div>)
  }
}

export default MainPage
