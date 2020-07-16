import React from 'react';

import './TrackList.css';

import Track from '../Track/Track';

class TrackList extends React.Component {
    isInPlaylist(track) {
        let tracksIn = this.props.tracksInPlaylist;
        if (!tracksIn) {
            return;
        }
        return (tracksIn.find(savedTrack => (savedTrack.id === track.id))) ? true : false;
    }

    render() {
        return (
            <div className="TrackList">
                {
                    this.props.tracks.map(track => {
                        if (!this.isInPlaylist(track)) {
                            return <Track key={track.id}
                                track={track}
                                onAdd={this.props.onAdd}
                                onRemove={this.props.onRemove}
                                isRemoval={this.props.isRemoval}
                            />
                        } else {
                            return null;
                        }

                    })
                }
            </div>
        );
    }
}

export default TrackList;