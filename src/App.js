import React from 'react'
import {Grid} from '@material-ui/core'
import youtube from './api/youtube'
import {SearchBar, VideoDetail, VideoList} from './components'

class App extends React.Component {
    state = {
        videos: [],
        selectedVideo: null
    }

    handleSubmit = async (searchTerm) => {
        const response = await youtube.get('search', { 
            params: {
                part: 'snippet',
                maxResults: 5,
                key: 'AIzaSyDWH8fb6X_xjNxDwkR71LAACMeNpByvveM',
                q: searchTerm,
            }})

        this.setState({videos: response.data.items, selectedVideo: response.data.items[0]})   
    }

    onSelectVideo = (video) => {
       this.setState({selectedVideo: video})
    }

    componentDidMount() {
        this.handleSubmit('joe rogan')
    }

    render () {
        const {selectedVideo, videos} = this.state
        return (
            <Grid justify="center" spacing={10} container>
                <Grid item xs={12}>
                    <Grid container spacing={10}>
                        <Grid item xs={12}>
                            <SearchBar onFormSubmit={this.handleSubmit}></SearchBar>
                        </Grid>
                        <Grid item xs={8}>
                            <VideoDetail video={selectedVideo}></VideoDetail>
                        </Grid>
                        <Grid item xs={4}>
                            <VideoList videos={videos} onSelectVideo={this.onSelectVideo}></VideoList>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default App