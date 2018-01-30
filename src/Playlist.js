import React, { Component } from 'react';

export default class Playlist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			someSate: null
		}
	}

	componentWillMount() {}
	componentDidMount() {}

	render() {
		return <h1>PLAYLIST</h1>
	}
}