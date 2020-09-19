import React from 'react';
import { connect } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { FormControl, Button, InputLabel, Select, MenuItem } from '@material-ui/core';

import * as actions from '../../redux/actions';
import { getUser } from "../../redux/selectors"

class PageLogin extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoadingUsers: true,
            isLoginRequired: true,
            users: [],
            selectedUserId: null
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/users').then(res => {
            this.setState({
                users: res.data,
                isLoadingUsers: false
            });
        });
    }

    performLogin = () => {
        const user = this.findUserById(this.state.selectedUserId);
        this.props.setUser(user);
        this.props.history.push("/")
    }

    findUserById(userId) {
        return this.state.users.find(user => user._id === userId);
    }

    render() {
        const { currentUser } = this.props;
        const { isLoadingUsers, users, selectedUserId } = this.state;
        if (isLoadingUsers) {
            return <p>Loading users...</p>
        }

        return (
            users.length <= 0 ?
                <p>There are currently no users. Please add users to perform any action.</p>
                : <div>
                    <FormControl>
                        <InputLabel>User</InputLabel>
                        <Select
                            value={selectedUserId}
                            onChange={(event) => {
                                const userId = event.target.value;
                                this.setState({ selectedUserId: userId })
                            }}
                            autoWidth={true}
                        >
                            {users.map(user =>
                                <MenuItem key={user._id} value={user._id}>
                                    {user.name}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <Button onClick={() => this.performLogin()}>Login</Button>
                </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        currentUser: getUser(state)
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