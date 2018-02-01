import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

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
        <input type="text" onKeyUp={event => 
          this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {  
  let playlist = this.props.playlist  
    return(
      <div style={{...defaultStyle, width: "25%", display: 'inline-block'}}>
        <img src={playlist.imageUrl} style={{width: '160px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
      }
  }
  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({serverData: fakeServerData})
    // }, 1000);    

    // Fake Server data
    let parsed = queryString.parse(window.location.search);
    console.log(parsed);
    let accessToken = parsed.access_token;
    if(!accessToken){
      return;
    }
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}})
    .then((response) => response.json())
    .then(data => this.setState({
      user: {
        name: data.display_name
      }
    }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}})
    .then((response) => response.json())
    .then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromises = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let trackDataPromise = responsePromise
          .then(response => response.json())
        return trackDataPromise
      })
      let allTracksDataPromises = Promise.all(trackDataPromises)
      let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items.map(item => item.track)
        })
        return playlists
      })
      return playlistsPromise
    })
    .then(playlists => this.setState({
      playlists: playlists.map(item => {
        console.log(item.trackDatas)
        return{
          name: item.name, 
          imageUrl: item.images[1].url,
          songs: item.trackDatas.map(trackData => ({
            name: trackData.name
          }))
        }
      })
    }))
  }
  render() {

    // let playlistElements = []
    // if(this.state.serverData.user) {
    //   for(let i=0; i < this.state.serverData.user.playlists.length; i++){
    //     let playlist = this.state.serverData.user.playlists[i]
    //     playlistElements.push(<Playlist playlist={playlist} />)
    //   }
    // }

    // This is an example of how to use a for loop instead of using the .map() method
    // {playListElements}


    // let playlistElements = []
    // if(this.state.serverData.user) {
    //  this.state.serverData.user.playlists.forEach(playlist => 
    //    playlistElements.push(<Playlist playlist={playlist} />)
    //  )
    // }

    // This is an example of how to use a forEach method instead of using the .map() method
    // {playListElements}

    let playlistsToRender = 
      this.state.user && 
      this.state.playlists 
        ? this.state.playlists.filter(playlist =>
          playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())) 
        : []

    return (
      <div className="App">
        { this.state.user ? 
        <div>
          <h1 style={{...defaultStyle, 'font-size': '54px'}}>
            {this.state.user.name}'s Playlists
          </h1>

          <PlaylistCounter playlists={playlistsToRender}/>
          <HoursCounter playlists={playlistsToRender}/>     
          <Filter onTextChange={text => this.setState({filterString: text})}/>
          {playlistsToRender.map((playlist, i) => 
            <Playlist playlist={playlist} key={ `playlist-item-${ i }` } />
          )}

        </div> : <button onClick={()=> {
          
          window.location = window.location.href.includes('localhost') 
            ? 'http://localhost:8888/login' 
            : 'http://jj-better-playlists-backend.herokuapp.com/login'} 
          }
          style={{padding: '20px', 'font-size': '20px', 'margin-top': '20px'}}>Sign in with Spotify</button>

        }        
      </div>
    );
  }
}

export default App;
