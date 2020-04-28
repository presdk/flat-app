import React from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

import * as selectors from '../redux/selectors';

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
                        Bills Splitter {this.props.user ? this.props.user.name : null}
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: selectors.getUser(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)