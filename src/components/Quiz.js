import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from "@material-ui/core/Button";
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useEffect, useRef } from 'react'
import useState from 'react-usestateref';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const useStyles = makeStyles({
    paper: {
        fontSize: "24px",
        fontWeight: "bold",
        width: "90%",
        margin: "auto",
        alignItems: "flex-start",
        textAlign: "center",
        display: "flex"
    },
    player: {
        marginTop: "auto",
        marginBottom: "auto",
        padding: "3%",
        width: "20%",
        height: "5%"
    },
    numberGuessed: {
        marginTop: "auto",
        marginBottom: "auto",
        paddingLeft: "3%",
    },
    timeLeft: {
        marginTop: "auto",
        marginBottom: "auto",
        paddingLeft: "35%",
        alignSelf: "flex-end"
    },
    table: {
        height: "10%",
        width: "20%",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
        paddingLeft: "3%"

    },
    tableRow: {
        height: "10%",
        width: "20%"
    },
    tableCell: {
        height: "10%",
        padding: "0px 5px",
        width: "20%",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center"
    },
    tableCellAnswered: {
        height: "10%",
        padding: "0px 5px",
        width: "20%",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
        backgroundColor: "#90EE90"
    }
});

function Quiz() {    
    const classes = useStyles();

    const [generations, changeGenerations] = useState([]);
    const [openGenerations, changeOpenGenerationMenu] = useState(null);
    const [selected, changeSelected] = useState('generation-i');
    const [pokemon, changePokemon, pokemonRef] = useState({
        name: [],
        id: [],
        answered: []
    });
    const [guess, changeGuess, guessRef] = useState("");
    const [playing, changePlaying] = useState(false);
    const [win, changeWin] = useState(false);
    const [open, changeOpen] = React.useState(false);
    const timerIdRef = useRef(0);
    const [count, setCount, countRef] = useState(960);

    useEffect(() => {
        axios.get(`https://pokeapi.co/api/v2/generation?limit=18`).then(res => {
            changeGenerations(res.data.results);
        });
        getPokes("generation-i");
        return () => clearInterval(timerIdRef.current);
    }, []);

    useEffect(() => {
        getPokes(selected);
        changePlaying(false);
        stopHandler();
        changeWin(false);
    }, [selected]);

    useEffect(() => {
        if(count === 0) {
            console.log("object")
            stopHandler();
            changeOpen(true);
            changeWin(-1);
        }
    }, [count]);


    const startHandler = () => {
        changePlaying(true)
        if (timerIdRef.current) { return; }
        timerIdRef.current = setInterval(() => setCount(c => c-1), 1000);
    };

    const stopHandler = () => {
        clearInterval(timerIdRef.current);
        timerIdRef.current = 0;
    };

    const timeToString = (time) => {
        const seconds = Math.floor((time) % 60);
        const minutes = Math.floor((time/ 60) % 60);
        return (minutes > 9 ? minutes : '0' + minutes) + ':'
        + (seconds > 9 ? seconds : '0' + seconds)
    }

    const getPokes = (gen) => {
        axios.get(`https://pokeapi.co/api/v2/generation/${gen.toLowerCase()}`).then(res => {
            var pokes = res.data.pokemon_species;
            pokes.sort((a, b) => {
                var ida = parseInt(a.url.substr(42, 3).replace(/\//g, ""));
                var idb = parseInt(b.url.substr(42, 3).replace(/\//g, ""));
                return ida - idb;
            });
            var pokeNames = pokes.map((value) => value.name);
            var pokeIDs = pokes.map((value) => parseInt(value.url.substr(42, 3).replace(/\//g, "")))
            var answered = pokes.map((value) => false);
            console.log(pokeNames, pokeIDs);
            changePokemon({
                name: pokeNames,
                id: pokeIDs,
                answered: answered
            });
            setCount((parseInt(pokeNames.length/10)+1) * 60 );
        });
    }

    const handleCloseGenMenu = (e, generation) => {
        changeOpenGenerationMenu(false);
        if(generation !== "Same") 
            changeSelected(generation);
    }

    const openGenMenu = (e) => {
        changeOpenGenerationMenu(e.target);
    }

    const checkGuess = (e) => {
        changeGuess(e.target.value);
        var id = pokemon.name.indexOf(e.target.value.toLowerCase().replace(/\s\s+/g, " ").split(".").join("").replace(/\s/g, "-"));
        if(id !== -1) {
            console.log("Correct:", e.target.value)
            var currentPokemon = pokemonRef.current;
            currentPokemon.answered[id] = true
            changePokemon(currentPokemon);
            if(pokemon.answered.filter(value => value === true).length === pokemon.answered.length) {
                stopHandler();
                changeOpen(true);
                changeGuess("");
                changeWin(1);
            }
        }
        
    }
    
    const handleClose = () => {
        changeOpen(false);
    };

    return (
        <div>
            {win === 1 ? (
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>Congratulations!!! You have beaten the PokeDex</DialogTitle>
                    <DialogContent>
                        You are a certified Pokemon master!<br/><br/>
                        <Button onClick={handleClose} color="primary" variant="contained">Close</Button>
                    </DialogContent>
                </Dialog>
            ) : win === -1 ? (
                <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>You have run out of time</DialogTitle>
                    <DialogContent>
                        Try again next time.<br/><br/>
                        <Button onClick={handleClose} color="primary" variant="contained">Close</Button>
                    </DialogContent>
                </Dialog>
            ) : (<div/>)}
            <h1>Welcome to Beat The Dex</h1>
            <div>Can you beat the PokeDex?</div><br/>
            <label>Generation: <Button variant="outlined" onClick={(e) => openGenMenu(e)}>{selected}</Button></label>
            <Menu keepMounted open={Boolean(openGenerations)} anchorEl={openGenerations} onClose={(e) => handleCloseGenMenu(e, "Same")}>
                {generations.map(generation => (
                    <MenuItem key={generation.name.toUpperCase()} onClick={(e) => handleCloseGenMenu(e, generation.name.toUpperCase())}>{generation.name.toUpperCase()}</MenuItem>
                ))}
            </Menu><br/><br/>
            <Paper variant="outlined" className={classes.paper} >
                <div className={classes.player} >
                    {playing ? (
                        <TextField disabled={win} label="Pokemon" variant="outlined" value={guess} onChange={(e) => checkGuess(e)} />
                    ) : (
                        <IconButton onClick={startHandler} variant="contained" color="primary" size="medium">
                            Start Playing<PlayArrowIcon/>
                        </IconButton>
                    )}
                </div>
                <div className={classes.numberGuessed}>
                    {pokemon ? pokemon.answered.filter(value => value === true).length : 0}/{pokemon.answered.length}
                </div>
                <div className={classes.timeLeft} >{timeToString(count)}</div><br/><br></br>
            </Paper>
            <Paper className={classes.paper}>
                <Table className={classes.table}>
                    <TableBody>
                        <TableRow className={classes.tableRow}>
                            <TableCell className={classes.tableCell}>ID</TableCell>
                            <TableCell className={classes.tableCell}>Pokemon</TableCell>
                        </TableRow>
                        {pokemon.name.slice(0, Math.floor(pokemon.name.length/5)+1).map((value, index) => (
                            <TableRow className={classes.tableRow}>
                                <TableCell className={classes.tableCell}>{pokemon.id[index]}</TableCell>
                                <TableCell className={pokemon.answered[index] ? classes.tableCellAnswered : classes.tableCell}>{pokemon.answered[index] ? value.toUpperCase() : ""}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Table className={classes.table}>
                    <TableBody>
                        <TableRow>
                            <TableCell className={classes.tableCell}>ID</TableCell>
                            <TableCell className={classes.tableCell}>Pokemon</TableCell>
                        </TableRow>
                        {pokemon.name.slice(Math.floor(pokemon.name.length/5)+1, 2 * Math.floor(pokemon.name.length/5)+1).map((value, index) => (
                            <TableRow>
                                <TableCell className={classes.tableCell}>{pokemon.id[Math.floor(pokemon.name.length/5)+1 + index]}</TableCell>
                                <TableCell className={pokemon.answered[Math.floor(pokemon.name.length/5)+1 + index] ? classes.tableCellAnswered : classes.tableCell}>{pokemon.answered[Math.floor(pokemon.name.length/5)+1 + index] ? value.toUpperCase() : ""}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Table className={classes.table}>
                    <TableBody>
                        <TableRow>
                            <TableCell className={classes.tableCell}>ID</TableCell>
                            <TableCell className={classes.tableCell}>Pokemon</TableCell>
                        </TableRow>
                        {pokemon.name.slice(2 * Math.floor(pokemon.name.length/5)+1, 3 * Math.floor(pokemon.name.length/5)+1).map((value, index) => (
                            <TableRow>
                                <TableCell className={classes.tableCell}>{pokemon.id[2*Math.floor(pokemon.name.length/5)+1 + index]}</TableCell>
                                <TableCell className={pokemon.answered[2*Math.floor(pokemon.name.length/5)+1 + index] ? classes.tableCellAnswered : classes.tableCell}>{pokemon.answered[2*Math.floor(pokemon.name.length/5)+1 + index] ? value.toUpperCase() : ""}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Table className={classes.table}>
                    <TableBody>
                        <TableRow>
                            <TableCell className={classes.tableCell}>ID</TableCell>
                            <TableCell className={classes.tableCell}>Pokemon</TableCell>
                        </TableRow>
                        {pokemon.name.slice(3 * Math.floor(pokemon.name.length/5)+1, 4 * Math.floor(pokemon.name.length/5)+1).map((value, index) => (
                            <TableRow>
                                <TableCell className={classes.tableCell}>{pokemon.id[3*Math.floor(pokemon.name.length/5)+1 + index]}</TableCell>
                                <TableCell className={pokemon.answered[3*Math.floor(pokemon.name.length/5)+1 + index] ? classes.tableCellAnswered : classes.tableCell}>{pokemon.answered[3*Math.floor(pokemon.name.length/5)+1 + index] ? value.toUpperCase() : ""}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Table className={classes.table}>
                    <TableBody>
                        <TableRow>
                            <TableCell className={classes.tableCell}>ID</TableCell>
                            <TableCell className={classes.tableCell}>Pokemon</TableCell>
                        </TableRow>
                        {pokemon.name.slice(4 * Math.floor(pokemon.name.length/5)+1).map((value, index) => (
                            <TableRow>
                                <TableCell className={classes.tableCell}>{pokemon.id[4*Math.floor(pokemon.name.length/5)+1 + index]}</TableCell>
                                <TableCell className={pokemon.answered[4*Math.floor(pokemon.name.length/5)+1 + index] ? classes.tableCellAnswered : classes.tableCell}>{pokemon.answered[4*Math.floor(pokemon.name.length/5)+1 + index] ? value.toUpperCase() : ""}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    )
}

export default Quiz
