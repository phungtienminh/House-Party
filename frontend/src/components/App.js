import React, { Component } from 'react';
import HomePage from './HomePage';


export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HomePage />
            </div>  
        );
    }
}
