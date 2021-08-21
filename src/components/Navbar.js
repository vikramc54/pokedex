import { AppBar, Toolbar } from '@material-ui/core'
import React, { useState } from 'react'
import '../App.css';
import { useHistory } from 'react-router-dom';

function Navbar() {
    var history = useHistory();
    const homeRedirect = () => {
        if(window.location.pathname !== "/")
            history.push("/");
    }

    const dexRedirect = () => {
        history.push("/pokedex");
    }

    const quizRedirect = () => {
        history.push("/quiz");
    }
    
    return (
        <div>
            <AppBar position="static" className="navbar">
                <Toolbar>
                    <h3 onClick={(e) => homeRedirect()} className="logo" >NatDex</h3>
                    <h3 onClick={(e) => dexRedirect()} className="navlinks" >PokeDex</h3>
                    <h3 onClick={(e) => quizRedirect()} className="navlinks" >Beat The Dex</h3>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar
