import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer';

const Room = (props) => {
    let { roomCode } = useParams();
    let navigate = useNavigate();
    const [room, setRoom] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
        showSettings: false,
        spotifyAuthenticated: false,
        song: {}
    });

    useEffect(() => {
        getRoomDetails();
        getCurrentSong();
        
        let interval = setInterval(getCurrentSong, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (room.isHost) {
            authenticateSpotify();
        }
    }, [room.isHost]);

    const getCurrentSong = () => {
        fetch('/spotify/current-song')
            .then((response) => {
                if (!response.ok) {
                    return {};
                }

                return response.json();
            })
            .then((data) => {
                console.log(data);
                setRoom((prevState) => {
                    return {
                        ...prevState,
                        song: data
                    };
                });
            });
    };

    const getRoomDetails = () => {
        fetch('/api/get-room' + '?code=' + roomCode)
            .then((response) => {
                if (!response.ok) {
                    props.leaveRoomCallback();
                    navigate('/');
                }

                return response.json();
            })
            .then((data) => {
                setRoom((prevState) => {
                    return {
                        ...prevState,
                        votesToSkip: data.votes_to_skip,
                        guestCanPause: data.guest_can_pause,
                        isHost: data.is_host
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated')
            .then((response) => response.json())
            .then((data) => {
                setRoom((prevState) => {
                    return {
                        ...prevState,
                        spotifyAuthenticated: data.status
                    };
                });

                if (!data.status) {
                    fetch('/spotify/get-auth-url')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
            });
    };

    const handleLeaveButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        fetch('/api/leave-room', requestOptions)
            .then((response) => {
                props.leaveRoomCallback();
                navigate('/');
            });
    };

    const updateShowSettings = (value) => {
        setRoom((prevState) => {
            return {
                ...prevState,
                showSettings: value
            };
        });
    };

    const renderSettings = () => {
        return (
            <Grid container spacing={1} align="center">
                <Grid item xs={12}>
                    <CreateRoomPage 
                        update={true} 
                        votesToSkip={room.votesToSkip} 
                        guestCanPause={room.guestCanPause} 
                        roomCode={roomCode} 
                        updateCallback={getRoomDetails}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    };

    if (room.showSettings) {
        return renderSettings();
    }

    return (
        <Grid container spacing={1} align="center" alignItems="center">
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <MusicPlayer {...room.song} />
            {room.isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={handleLeaveButtonPressed}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
        
    );
};

export default Room;