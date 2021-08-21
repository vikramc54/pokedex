import Paper from '@material-ui/core/Paper';
import Button from "@material-ui/core/Button";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";
import useState from 'react-usestateref';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles({
    grid: {
        width: "90%",
        margin: "auto",
        textAlign: "center",
        border: "solid 1px #aaaaaa",
        borderRadius: "5px"
    },
    head: {
        alignSelf: "center"
    },
    desc: {
        // whiteSpace: "pre"
    },
    spritesDiv: {
        display: "inline-block",
        width: "40%",
        backgroundColor: "#ccc",
        borderRadius: "10px",
        margin: "0px 1px"
    },
    sprites: {
        width: "100%"
    },
});

function Pokemon() {
    const classes = useStyles();

    var id = useParams().pokemonName;

    const [pokemon, changePokemon] = useState({});

    useEffect(() => {        
        fetchPoke();
    }, []);

    const fetchPoke = async () => {
        var poke;
        id = parseInt(id);
        await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => {
            poke = {pokemonData: res.data};
        });
        await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then(res => {
            poke = {
                ...poke,
                speciesData: res.data
            };
        });
        changePokemon(poke)
    }

    return (
        <div>
            {pokemon.pokemonData ? (
                <div>
                    <Grid container spacing={0} className={classes.grid} >
                        <Grid item xs={12}>
                            <h2 className={classes.head}>#{id}: {pokemon.pokemonData.name.toUpperCase()}</h2>
                        </Grid>                    
                    </Grid>
                    <Grid container spacing={1} >
                        <Grid item xs={6}>
                            <div className={classes.spritesDiv}>
                                <img src={pokemon.pokemonData.sprites.front_default} className={classes.sprites} /><br/>Normal Sprite
                            </div>
                            <div className={classes.spritesDiv}>
                                <img src={pokemon.pokemonData.sprites.front_shiny} className={classes.sprites} /><br/>Shiny Sprite
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className={classes.desc}>
                                <h3>Description:</h3>
                                {pokemon.speciesData.flavor_text_entries[0].flavor_text.replace(/\f/g, " ")}
                                <h3>Stats:</h3>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center">HP</TableCell>
                                            <TableCell align="center">Atk</TableCell>
                                            <TableCell align="center">Def</TableCell>
                                            <TableCell align="center">Sp.Atk</TableCell>
                                            <TableCell align="center">Sp.Def</TableCell>
                                            <TableCell align="center">Speed</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            {pokemon.pokemonData.stats.map((value) => (
                                                <TableCell align="center">{value.base_stat}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </Grid>
                    </Grid><br/><br/>
                    <Grid container spacing={1}>
                        <Grid item xs={1}>

                        </Grid>
                        <Grid item xs={4}>
                            <h3>Type:</h3>
                            {pokemon.pokemonData.types[0].type.name.toUpperCase()}
                            {pokemon.pokemonData.types[1] ? " & " + pokemon.pokemonData.types[1].type.name.toUpperCase() : ""}
                        </Grid>
                        <Grid item xs={6}>
                            <h3>Ability:</h3>
                            {pokemon.pokemonData.abilities[0].ability.name.toUpperCase()}
                            {pokemon.pokemonData.abilities[1] ? " or " + pokemon.pokemonData.abilities[1].ability.name.toUpperCase().replace(/-/g, " ") : ""}
                            {pokemon.pokemonData.abilities[2] ? " or " + pokemon.pokemonData.abilities[2].ability.name.toUpperCase().replace(/-/g, " ") + "(Hidden)" : ""}
                        </Grid>
                    </Grid>                    
                </div>
            ) : (
                <CircularProgress/>
            )}
        </div>
    )
}

export default Pokemon
