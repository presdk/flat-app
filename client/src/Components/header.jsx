import React from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

import * as selectors from '../redux/selectors';

class Header extends React.Component {
    constructor() {
        super();
    }

    render() {
        const { currentUser } = this.props;

        return (
            <AppBar position="static" style={{ marginBottom: '8px' }}>
                <Toolbar>
                    <Typography variant="h6">
                        Bills Splitter {currentUser ? `> ${currentUser.name}` : null}
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: selectors.getUser(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)