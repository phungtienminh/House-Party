import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography } from '@material-ui/core';
import { Link, useParams, useNavigate } from 'react-router-dom';

const RoomJoinPage = (props) => {
    let navigate = useNavigate();
    let [roomJoinState, setRoomJoinState] = useState({
        roomCode: "",
        error: "" 
    });

    const handleTextFieldChange = (e) => {
        setRoomJoinState((prevState) => {
            return {
                ...prevState,
                roomCode: e.target.value
            };
        });
    };

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: roomJoinState.roomCode
            })
        };

        fetch('/api/join-room', requestOptions)
            .then((response) => {
                if (response.ok) {
                    navigate(`/room/${roomJoinState.roomCode}`);
                } else {
                    setRoomJoinState((prevState) => {
                        return {
                            ...prevState,
                            error: 'Room not found.'
                        };
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    error={roomJoinState.error}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={roomJoinState.roomCode}
                    helperText={roomJoinState.error}
                    variant="outlined"
                    onChange={handleTextFieldChange}
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleRoomButtonPressed}>
                    Enter Room
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    );
};

export default RoomJoinPage;