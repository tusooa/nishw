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
