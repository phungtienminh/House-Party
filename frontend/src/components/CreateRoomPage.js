import React, { Component, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Link } from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Collapse } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const CreateRoomPage = (props) => {
    let navigate = useNavigate();
    let [roomConfig, setRoomConfig] = useState({
        guestCanPause: props.guestCanPause,
        votesToSkip: props.votesToSkip,
        errorMsg: '',
        successMsg: '',
    });

    const handleVotesChange = (e) => {
        setRoomConfig((prevState) => {
            return {
                ...prevState,
                votesToSkip: e.target.value
            };
        });
    };

    const handleGuestCanPauseChange = (e) => {
        setRoomConfig((prevState) => {
            return {
                ...prevState,
                guestCanPause: e.target.value === 'true' ? true : false
            };
        });
    };

    const handleRoomButtonPressed = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                votes_to_skip: roomConfig.votesToSkip,
                guest_can_pause: roomConfig.guestCanPause,
            })
        };

        fetch('/api/create-room', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                //this.props.history.push('/room/' + data.code)
                navigate(`/room/${data.code}`);
            })
            .catch((error) => console.log(error));
    };

    const handleUpdateButtonPressed = () => {
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                votes_to_skip: roomConfig.votesToSkip,
                guest_can_pause: roomConfig.guestCanPause,
                code: props.roomCode
            })
        };

        fetch('/api/update-room', requestOptions)
            .then((response) => {
                if (response.ok) {
                    setRoomConfig((prevState) => {
                        return {
                            ...prevState,
                            successMsg: 'Room updated successfully!'
                        };
                    });
                } else {
                    setRoomConfig((prevState) => {
                        return {
                            ...prevState,
                            errorMsg: 'Error updating room...'
                        };
                    });
                }
                props.updateCallback();
            })
            .catch((error) => console.log(error));
    };

    const renderCreateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleRoomButtonPressed}>
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const renderUpdateButtons = () => {
        return (
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>
                    Update Room
                </Button>
            </Grid>
        );
    };

    const title = props.update ? 'Update Room' : 'Create A Room';


    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={roomConfig.errorMsg != '' || roomConfig.successMsg != ''}>
                    {roomConfig.successMsg != '' ? (
                        <Alert severity="success" onClose={() => {setRoomConfig((prevState) => {return {...prevState, successMsg: ''} })}}>{roomConfig.successMsg}</Alert>
                    ) : (
                        <Alert severity="error" onClose={() => {setRoomConfig((prevState) => {return {...prevState, errorMsg: ''}})}}>{roomConfig.errorMsg}</Alert>
                    )}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={roomConfig.guestCanPause.toString()} onChange={handleGuestCanPauseChange}>
                        <FormControlLabel 
                            value="true" 
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField 
                        required={true}
                        type="number"
                        onChange={handleVotesChange}
                        defaultValue={roomConfig.votesToSkip}
                        inputProps={{
                            min: 1,
                            style: {
                                textAlign: "center"
                            },
                        }}
                    />
                    <FormHelperText>
                        <div align="center">
                            Votes Required To Skip Song
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {props.update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>
    );
};

CreateRoomPage.defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {}
};

export default CreateRoomPage;