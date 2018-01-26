import React, { Component } from 'react';
import './App.css';

let defaultStyle = {
  color: '#000'
};
let fakeServerData = {
  user: {
    name: 'Josh',
    playlists:[
      {
        name: 'My Favorites',
        songs: [
          { name:'Song 1', duration: 1345},
          { name: 'Song 2', duration: 2143},
          { name: 'Long Song Name With Many Words 3', duration:1573}
        ]
      },
      {
        name: 'Discover Weekly',
        songs: [
          { name:'Song 1', duration: 1345},
          { name: 'Song 2', duration: 2143},
          { name: 'Long Song Name With Many Words 3', duration:1573}
        ]      
      },
      {
        name: 'Another Playlist - the best one',
        songs: [
          { name:'Song 1', duration: 1345},
          { name: 'Song 2', duration: 2143},
          { name: 'Long Song Name With Many Words 3', duration:1573}
        ]        
      },
      {
        name: 'Cool Guy Playlist',
        songs: [
          { name:'Song 1', duration: 1345},
          { name: 'Song 2', duration: 2143},
          { name: 'Long Song Name With Many Words 3', duration:1573}
        ]        
      }
    ]
  }

};

class PlaylistCounter extends Component {
  render() {
    return(
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return(
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{Math.round(totalDuration/60)} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img />
        <input type="text"/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return(
      <div style={{...defaultStyle, width: "25%", display: 'inline-block'}}>
        <img />
        <h3>Playlist Name</h3>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {serverData: {}}
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({serverData: fakeServerData})
    }, 2000);
  }
  render() {
    return (
      <div className="App">
        { this.state.serverData.user ? 
        <div>
          <h1 style={{...defaultStyle, 'font-size': '54px'}}>
            {this.state.serverData.user.name}'s Playlists
          </h1>}
          <PlaylistCounter playlists={this.state.serverData.user.playlists}/>
          <HoursCounter playlists={this.state.serverData.user.playlists}/>     
          <Filter/>
          <Playlist/>
          <Playlist/>
          <Playlist/>
          <Playlist/>
        </div> : <h1 style={defaultStyle}>Loading...</h1>

        }        
      </div>
    );
  }
}

export default App;
