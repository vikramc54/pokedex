import { Grid, Paper } from '@material-ui/core'
import React from 'react';
import pokedex from "../images/pokedex.png";
import pokeball from "../images/pokeball.png";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    pokedex: {
        margin: "auto",
        width: "70%"
    },
    pokeball: {
        margin: "auto",
        width: "50%"
    },
    image: {
        margin: "auto",
        width: "200px",
        height: "200px"
    },
    grid: {
        cursor: "pointer"
    }
});

function Home() {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div>
            <h1>Welcome to NatDex</h1>
            <Grid container spacing={3}>
                <Grid item xs={1}></Grid>
                <Grid item xs={4} className={classes.grid} onClick={() => history.push("/pokedex")} >
                    <Paper variant="outlined">
                        <h3>Check out our PokeDex</h3>
                        <img className={classes.image} src={pokedex} />
                    </Paper>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={4} className={classes.grid} onClick={() => history.push("/quiz")} >
                    <Paper variant="outlined">
                        <h3>See if you can beat the Dex</h3>
                        <img className={classes.image} src={pokeball} />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default Home
