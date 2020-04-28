import React from 'react';
import axios from 'axios';
import { Select, MenuItem } from '@material-ui/core';

class PageLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            user_options: [],
            selected_user: undefined
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/users').then(res => {
            this.setState({ user_options: res.data });
        });
    }
    
    render() {
        const select_items = this.state.user_options.map(user => {
            return (
                <MenuItem 
                    key={user._id}
                    value={user.name}
                >
                    {user.name}
                </MenuItem>
            )
        })
        return (
            <div>
                <Select
                    value={this.state.selected_user}
                    onChange={(event) => this.setState({ selected_user: event.target.value })}
                    displayEmpty
                >
                    {select_items}
                </Select>
            </div>
        )
    }
}

export default PageLogin