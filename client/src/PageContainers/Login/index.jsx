import React from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { FormControl, Button, InputLabel, Select, MenuItem } from '@material-ui/core';

import * as actions from '../../redux/actions';

class PageLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            loggedIn: false,
            user_options: [],
            selected_user: undefined
        }
    }

    setUser = userId => {
        this.setState({ selected_user: userId })
    }

    login = () => {
        let user_states = null;
        this.state.user_options.forEach(user => {
            if (user._id === this.state.selected_user) {
                user_states = user
            }
        });
        this.props.setUser(user_states);
        this.setState({ loggedIn: true })
    }

    componentDidMount() {
        axios.get('http://localhost:4000/users').then(res => {
            this.select_items = res.data.map(user => {
                return (
                    <MenuItem 
                        key={user._id}
                        value={user._id}
                    >
                        {user.name}
                    </MenuItem>
                )
            });
            this.setState({ user_options: res.data });
        });
    }
    
    render() {
        return (
            <div>
                {this.state.loggedIn ? <Redirect to="/"/> : null}
                <FormControl>
                    <InputLabel>User</InputLabel>
                    <Select
                        value={this.state.selected_user}
                        onChange={(event) => this.setUser(event.target.value)}
                        autoWidth={true}
                    >
                        {this.select_items ? this.select_items : null}
                    </Select>
                </FormControl>
                <Button onClick={() => this.login()}>Login</Button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser: user => {
            dispatch(actions.setUser(user))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageLogin)