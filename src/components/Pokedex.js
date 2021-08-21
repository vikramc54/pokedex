import { Button, Icon, TextField } from '@material-ui/core'
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from '@material-ui/icons/FilterList';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import useState from 'react-usestateref';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles({
    paper: {
        margin: "auto",
        height: "60px",
        width: "80%",
        alignItems: "flex-start",
        textAlign: "center",
        display: "flex"
    },
    id: {
        marginTop: "auto",
        marginBottom: "auto",
        paddingLeft: "3%",
        width: "5%",
        textAlign: "center",
        fontSize: "12px",
        textDecoration: "underline",
        cursor: "pointer"
    },
    sprite: {
        marginTop: "auto",
        marginBottom: "auto",
        width: "60px",
        height: "60px",
        paddingLeft: "3%",
        cursor: "pointer"
    },
    name: {
        marginTop: "auto",
        marginBottom: "auto",
        paddingLeft: "3%",
        width: "25%",
        textAlign: "center",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer"
    },
    types: {
        marginTop: "auto",
        marginBottom: "auto",
        width: "15%",
        textAlign: "center",
        fontSize: "13px",
        cursor: "default"
    },
    abilities: {
        marginTop: "auto",
        marginBottom: "auto",
        width: "15%",
        textAlign: "center",
        fontSize: "13px",
        cursor: "default"
    },
    id_heading: {
        marginTop: "auto",
        marginBottom: "auto",
        paddingLeft: "3%",
        width: "5%",
        textAlign: "center",
        fontSize: "12px",
        cursor: "default"
    },
    sprite_heading: {
        marginTop: "auto",
        marginBottom: "auto",
        width: "60px",
        height: "60px",
        paddingLeft: "3%",
        cursor: "default"
    },
    name_heading: {
        marginTop: "auto",
        marginBottom: "auto",
        paddingLeft: "3%",
        width: "25%",
        textAlign: "center",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "default"
    },
    filterButton: {
        marginTop: "auto",
        marginBottom: "auto",
        cursor: "pointer"
    },
  });

function Pokedex() {
    const history = useHistory();

    const classes = useStyles();
    const [filters, changeFilters] = useState({
        type: "None",
        generation: "None"
    });
    const [selected, changeSelected] = useState({
        type: "None",
        generation: "None"
    });
    const [pokes, changePokes] = useState([]);
    const [types, changeTypes] = useState([]);
    const [generations, changeGenerations] = useState([]);
    const [openDialog, changeOpenDialog] = useState(false);
    const [openTypes, changeOpenTypeMenu] = useState(null);
    const [openGenerations, changeOpenGenerationMenu] = useState(null);
    const [loading, changeLoading, loadingRef] = useState(true);
    const [offset, changeOffset] = useState(0);

    var fetchSize = 15;

    async function fetchPokes(mode="load") {
        changeLoading(true);
        var pokemon = [];
        if(filters.type.toLowerCase() === "none" && filters.generation.toLowerCase() === "none") {
            console.log("hiho")
            var currentOffset;
            changeOffset(oldOffset => {
                currentOffset = oldOffset;
                return oldOffset;
            })
            await axios.get(`https://pokeapi.co/api/v2/pokemon-species?limit=${fetchSize}&offset=${currentOffset}`).then(async (res) => {
                pokemon = res.data.results;
                console.log("pokemons", pokemon, currentOffset)
            });
            for(var i = 0; i < pokemon.length; i++){
                await axios.get(`https://pokeapi.co/api/v2/pokemon/${parseInt(pokemon[i].url.substr(42, 5).replace(/\//g, "")) 
                                                                     | parseInt(pokemon[i].url.substr(34, 5).replace(/\//g, ""))  }`).then(result => {
                    pokemon[i] = {
                        ...pokemon[i],
                        pokemonData: result.data
                    };
                });
                // changePokes(oldPoke => [...oldPoke, pokemon[i]])
            }
            if(mode==="add") {

                changePokes(oldPoke => [...oldPoke, ...pokemon]);
            }
            else
                changePokes([...pokemon]);
            changeLoading(false);
    
        }
        else if(filters.type.toLowerCase() === "none" || filters.generation.toLowerCase() === "none") {
            console.log("hellooo")
            if(filters.type.toLowerCase() === "none")
                await axios.get(`https://pokeapi.co/api/v2/generation/${filters.generation.toLowerCase()}`).then(async (res) => {
                    pokemon = (res.data.pokemon_species);
                    pokemon.sort((a, b) => {
                        var ida = parseInt(a.url.substr(42, 3).replace(/\//g, ""));
                        var idb = parseInt(b.url.substr(42, 3).replace(/\//g, ""));
                        return ida - idb;
                    });
                });
            else
                await axios.get(`https://pokeapi.co/api/v2/type/${filters.type.toLowerCase()}`).then(async (res) => {
                    pokemon = (res.data.pokemon.map(element => {
                        return element.pokemon
                    }));
                });
            for(var i = 0; i < pokemon.length; i++) {
                await axios.get(`https://pokeapi.co/api/v2/pokemon/${parseInt(pokemon[i].url.substr(42, 5).replace(/\//g, "")) 
                                                                        | parseInt(pokemon[i].url.substr(34, 5).replace(/\//g, ""))  }`).then(result => {
                    pokemon[i] = {
                        ...pokemon[i],
                        pokemonData: result.data
                    };
                });
            }
            changePokes([...pokemon]);
            changeLoading(false);
    
        }
        else {
            console.log("hiiiiii")
            await axios.get(`https://pokeapi.co/api/v2/generation/${filters.generation.toLowerCase()}`).then(async (res) => {
                pokemon = (res.data.pokemon_species);
            });
            
            pokemon.sort((a, b) => {
                var ida = parseInt(a.url.substr(42, 3).replace(/\//g, ""));
                var idb = parseInt(b.url.substr(42, 3).replace(/\//g, ""));
                console.log(ida, idb);
                return ida - idb;
            });
            for(var i = 0; i < pokemon.length; i++){
                console.log("starting");
                await axios.get(`https://pokeapi.co/api/v2/pokemon/${parseInt(pokemon[i].url.substr(42, 5).replace(/\//g, "")) 
                                                                        | parseInt(pokemon[i].url.substr(34, 5).replace(/\//g, ""))  }`).then(result => {
                    pokemon[i] = {
                        ...pokemon[i],
                        pokemonData: result.data
                    };
                });
            }
            
            var pokemon = pokemon.filter((value, index) => {
                if(value.pokemonData.types[0].type.name === filters.type.toLowerCase() || (value.pokemonData.types[1] ? (value.pokemonData.types[1].type.name === filters.type.toLowerCase()) : false ))
                    return value;
            });

            changePokes([...pokemon]);
            changeLoading(false);
    
        }
    }

    useEffect(() => {
        fetchPokes();
        window.addEventListener('scroll', handleScroll);
        axios.get(`https://pokeapi.co/api/v2/type?limit=18`).then(res => {
            changeTypes(res.data.results);
        })
        axios.get(`https://pokeapi.co/api/v2/generation?limit=18`).then(res => {
            changeGenerations(res.data.results);
        })
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        console.log("offset", offset);
        changeOffset(0);
        changePokes([]);
        changeLoading(true);
        fetchPokes();
    }, [filters]);

    useEffect(() => {
    }, [pokes]) 

    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight)
            return;
            {
            console.log('Fetch more list items!', filters.type.toLowerCase());
            console.log("filters", filters);
            var currentFilters;
            changeFilters((nowState) => {
                currentFilters = nowState;
                return nowState;
            });
            if(currentFilters.type.toLowerCase() === "none" && currentFilters.generation.toLowerCase() === "none") {
                console.log("add", offset)
                changeOffset(oldOffset => oldOffset + fetchSize);
                fetchPokes("add");
            }
        }
    }

    const openFilters = (e) => {
        e.preventDefault();
        changeOpenDialog(e.target);
    }

    const handleCloseDialog = (e, save) => {
        if(save === "Save") {
            changeFilters(selected);
            var currentFilters;
            changeFilters((nowState) => {
                currentFilters = nowState;
                return nowState;
            });
            if(currentFilters.type.toLowerCase() === "none" && currentFilters.generation.toLowerCase() === "none")
                changeOffset(0);
        }
        else 
            changeSelected(filters);
        changeOpenDialog(false);
    }

    const handleCloseTypeMenu = (e, type) => {
        changeOpenTypeMenu(false);
        if(type !== "Same") 
            changeSelected({...selected,
                type: type
            });
    }

    const openTypeMenu = (e) => {
        changeOpenTypeMenu(e.target);
    }

    const handleCloseGenMenu = (e, generation) => {
        changeOpenGenerationMenu(false);
        if(generation !== "Same") 
            changeSelected({...selected,
                generation: generation
            });
    }

    const openGenMenu = (e) => {
        changeOpenGenerationMenu(e.target);
    }

    const navigate = (e, pokemon) => {
        history.push(`/pokemon/${pokemon.pokemonData.id}`);
    }
    
    return (
        <div alignContent="center">
            <h1>PokeDex</h1>
            {/* <button onClick={(e) => console.log(pokes)}>click</button>
            <button onClick={(e) => console.log(offset)}>click2</button> */}

            {/* <TextField label="Search" value={searchValue} variant="outlined" onChange={(e) => changeSearchValue(e.target.value)} InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Icon>
                            <SearchIcon />
                        </Icon>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={(e) => openFilters(e)}>
                            <FilterListIcon />
                        </IconButton>
                    </InputAdornment>
                )
            }} /> */}
            <Dialog open={Boolean(openDialog)} onClose={(e) => handleCloseDialog(e, "No save")} anchorEl={openDialog} PaperProps={{  
                style: {  
                width: "30%",
                },  
            }} >
                <DialogTitle>Filters</DialogTitle>
                <DialogContent>
                    <label>Type: <Button variant="outlined" onClick={(e) => openTypeMenu(e)}>{selected.type}</Button></label>
                    <Menu keepMounted open={Boolean(openTypes)} anchorEl={openTypes} onClose={(e) => handleCloseTypeMenu(e, "Same")}>
                        <MenuItem key="None" onClick={(e) => handleCloseTypeMenu(e, "NONE")}>NONE</MenuItem>
                        {types.map(type => (
                            <MenuItem key={type.name.toUpperCase()} onClick={(e) => handleCloseTypeMenu(e, type.name.toUpperCase())}>{type.name.toUpperCase()}</MenuItem>
                        ))}
                    </Menu><br/><br/>
                    <label>Generation: <Button variant="outlined" onClick={(e) => openGenMenu(e)}>{selected.generation}</Button></label>
                    <Menu keepMounted open={Boolean(openGenerations)} anchorEl={openGenerations} onClose={(e) => handleCloseGenMenu(e, "Same")}>
                        <MenuItem key="None" onClick={(e) => handleCloseGenMenu(e, "NONE")}>NONE</MenuItem>
                        {generations.map(generation => (
                            <MenuItem key={generation.name.toUpperCase()} onClick={(e) => handleCloseGenMenu(e, generation.name.toUpperCase())}>{generation.name.toUpperCase()}</MenuItem>
                        ))}
                    </Menu><br/><br/>
                    <Button onClick={(e) => handleCloseDialog(e, "Save")} color="primary" variant="contained" >Save</Button>
                </DialogContent>
            </Dialog> 
            <Paper className={classes.paper} variant="outlined">
                <div className={classes.id_heading}>ID</div>
                <div className={classes.sprite_heading}></div>
                <div className={classes.name_heading}>Name</div>
                <div className={classes.types}>Type</div>
                <div className={classes.abilities}>Ability</div>
                <div className={classes.abilities}>Hidden Ability</div>
                <IconButton className={classes.filterButton} onClick={(e) => openFilters(e)}>
                    <FilterListIcon />
                </IconButton>
            </Paper>
            {pokes.map(poke => (
                <Paper onClick={(e) => console.log(poke)} className={classes.paper} variant="outlined" key={poke.name}>
                    <div className={classes.id} onClick={(e) => navigate(e, poke)}>#{poke.pokemonData.id}</div>
                    <img className={classes.sprite} onClick={(e) => navigate(e, poke)} src={poke.pokemonData.sprites.front_default}></img>
                    <div className={classes.name} onClick={(e) => navigate(e, poke)}>{poke.name.toUpperCase()}</div>
                    <div className={classes.types}>
                        {(poke.pokemonData.types[1] !== undefined) ? 
                            (<div>
                                {poke.pokemonData.types[0].type.name.toUpperCase()}
                                <br/>{poke.pokemonData.types[1].type.name.toUpperCase()}
                            </div>) :
                            (<div>
                                {poke.pokemonData.types[0].type.name.toUpperCase()}
                            </div>)}
                    </div>
                    <div className={classes.abilities}>
                        {(poke.pokemonData.abilities[1] !== undefined) ? 
                            (<div>
                                {poke.pokemonData.abilities[0].ability.name.toUpperCase().replace(/-/g, " ")}
                                <br/>{poke.pokemonData.abilities[1].ability.name.toUpperCase().replace(/-/g, " ")}
                            </div>) :
                            (<div>
                                {poke.pokemonData.abilities[0].ability.name.toUpperCase().replace(/-/g, " ")}
                            </div>)}
                    </div>
                    <div className={classes.abilities}>
                        {(poke.pokemonData.abilities[2] !== undefined) ? 
                            (<div>
                                {poke.pokemonData.abilities[2].ability.name.toUpperCase().replace(/-/g, " ")}
                            </div>) :
                            (<div>
                                -
                            </div>)}
                    </div>
                </Paper>
            ))}
            {(loadingRef.current ?  (
                <CircularProgress/>
            ) : (
                <br/>
            ))}
        </div>
    )
}

export default Pokedex
