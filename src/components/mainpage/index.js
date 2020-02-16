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

class MainPage extends React.Component
{
  /**
   * <MainPage matrix=... />
   */
  constructor(props)
  {
    super(props)

    console.log(props)
    this.state = {
      timeline: [],
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
  }

  componentDidMount()
  {
  }

  render()
  {
    return (
      <div>
        <ul>
          { this.state.timeline.map(msg => (
            <li key={ msg.getId() }>{msg.getSender()}: { msg.event.content.body }</li>
          ))
          }
        </ul>
      </div>)
  }
}

export default MainPage
