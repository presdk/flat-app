import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <AppBar position="static" style={{ marginBottom: '8px' }}>
                <Toolbar>
                    <Typography variant="h6">
                        Bills Splitter
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}

export default Header