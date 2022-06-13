import React, { Component, useState, useEffect } from 'react';
import { 
    BrowserRouter as Router, 
    Routes, 
    Route, 
    Link, 
    Redirect,
    Navigate,
    useParams,
    useNavigate 
} from 'react-router-dom';

import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';

import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core';
import Info from './Info';

const HomePage = (props) => {
    let [homeState, setHomeState] = useState({
        roomCode: null
    })

    useEffect(async () => {
        fetch('/api/user-in-room')
            .then((response) => response.json())
            .then((data) => {
                setHomeState({
                    roomCode: data.code
                });
            });
    }, []);

    const renderHomePage = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join a Room
                        </Button>
                        <Button color="default" to="/info" component={Link}>
                            Info
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    };

    const clearRoomCode = () => {
        setHomeState({
            roomCode: null
        });
    };

    return (
        <Router>
            <Routes>
                <Route exact path='/' element={homeState.roomCode ? (<Navigate replace to={`/room/${homeState.roomCode}`}/>) : renderHomePage()} />
                <Route path='/join' element={<RoomJoinPage />} />
                <Route path='/info' element={<Info />} />
                <Route path='/create' element={<CreateRoomPage />} />
                <Route path='/room/:roomCode' element={<Room leaveRoomCallback={clearRoomCode} />} />
            </Routes>
        </Router>
    );
};

export default HomePage;