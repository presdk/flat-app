import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Select, MenuItem } from '@material-ui/core';

import * as selectors from '../../redux/selectors';

import AppTable from '../../Components/table';

function sortByDate(a, b) {
    const dateA = a['date'].split('-');
    const dateB = b['date'].split('-');
    if (dateA[2] > dateB[2]) {
        return -1
    } else if (dateA[2] < dateB[2]) {
        return 1
    } else {
        if (dateA[1] > dateB[1]) {
            return -1
        } else if (dateA[1] < dateB[1]) {
            return 1
        } else {
            if (dateA[0] > dateB[0]) {
                return -1
            } else if (dateA[0] < dateB[0]) {
                return 1
            } else {
                return 0
            }
        }
    }
}

function sortByType(a, b) {
    if (a['type'] > b['type']) {
        return -1
    } else if (a['type'] < b['type']) {
        return 1
    } else {
        return sortByDate(a, b)
    }
}

function sortByStatus(a, b) {
    if (a['status'] > b['status']) {
        return -1
    } else if (a['status'] < b['status']) {
        return 1
    } else {
        const prelim = sortByDate(a, b);
        if (prelim === 0) {
            return sortByType(a, b)
        } else {
            return prelim
        }
    }
}

class PageDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data: []
        }
    }

    columns = [
        { key: 'date', name: 'Date', align: 'left', render: (cell, row) => this.renderBillRedirect(cell, row) },
        { key: 'type', name: 'Type', align: 'left' },
        { key: 'status', name: 'Status', align: 'left', render: (cell, row) => this.renderStatusSelect(cell, row) }
    ]

    renderBillRedirect = (cell, row) =>{
        return (
            <Link to={{
                pathname: '/bill',
                state: {bill_id: row._id}
            }}>
                {cell}
            </Link>
        )
    } 
    
    renderStatusSelect = (cell, row) => {
        return (
            <Select
                defaultValue={cell}
                onChange={event => this.handleStatusChange(event.target.value, row)}
            >
                <MenuItem value='unpaid'>unpaid</MenuItem>
                <MenuItem value='paid'>paid</MenuItem>
            </Select>
        )
    }
    
    handleStatusChange = (value, row) => {
        axios.post(
            `http://localhost:4000/bills/${row._id}/${this.props.user._id}/update`, 
            { status: value }
        )
    }

    handleRequestSort = (event, property) => {
        switch(property) {
            case 'date':
                return sortByDate
            case 'type':
                return sortByType
            case 'status':
                return sortByStatus
            default:
                return sortByDate
        }
    };

    componentDidMount() {
        axios.get('http://localhost:4000/bills').then(res => {
            var i = 0;
            res.data.forEach(item => {
                item.index = i;
                i++;
                item.payments.forEach(userItem => {
                    if (this.props.user && userItem.userId === this.props.user._id) {
                        item.status = userItem.status;
                    }
                });
            });
            this.setState({data: res.data});
        });
    }
    
    render() {
        return (   
            <div>
                <AppTable 
                    columns={this.columns}
                    data={this.state.data}
                    sorter={true}
                    requestDescSort={(event, property) => this.handleRequestSort(event, property)}
                    // defaultOrderBy='date'
                    // defaultOrder='desc'
                />
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PageDashboard)