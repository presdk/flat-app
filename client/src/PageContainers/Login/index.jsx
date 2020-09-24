import React from 'react';
import { connect } from 'react-redux'
import axios from 'axios';
import { Grid } from '@material-ui/core';

import * as actions from '../../redux/actions';
import { getUser } from "../../redux/selectors"
import UserBox from './UserBox';
import Hoverable from "../../Components/Hoverable";
import { generateHash } from "../../utils/hash";

class PageLogin extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoadingUsers: true,
            isLoginRequired: true,
            users: [],
            selectedUserId: -1
        }
    }

    componentDidMount() {
        if (this.props.currentUser != null) {
            this.setState({ selectedUserId: this.props.currentUser._id });
        }

        axios.get(`${process.env.REACT_APP_SERVER_API_ENDPOINT}/users`).then(res => {
            this.setState({
                users: res.data,
                isLoadingUsers: false
            });
        });
    }

    handleUserClicked = (userId) => {
        const user = this.findUserById(userId);
        this.props.setUser(user);
        this.props.history.push("/")
    }

    findUserById(userId) {
        return this.state.users.find(user => user._id === userId);
    }

    render() {
        const { isLoadingUsers, users, selectedUserId } = this.state;

        if (isLoadingUsers) {
            return <p>Loading users...</p>
        }

        return (
            users.length <= 0 ?
                <p>There are currently no users. Please add users to perform any action.</p>
                : <Grid container direction="row" justify="center">
                    {users.map(user => {
                        const isSelected = user._id === selectedUserId;
                        return (
                            <Hoverable isSelected={isSelected}>
                                <UserBox key={user._id}
                                    user={user}
                                    width="20vw" height="20vw"
                                    handleClick={() => this.handleUserClicked(user._id)} />
                            </Hoverable>
                        )
                    })}
                </Grid>
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