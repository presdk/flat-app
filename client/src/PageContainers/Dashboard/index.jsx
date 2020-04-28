import React from 'react';
import axios from 'axios';
import { Select, MenuItem } from '@material-ui/core';

import BillsTable from '../../Components/table';

// TEMP
const userID = "5ea694e25f7777161cfe2832";

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
        { key: 'date', name: 'Date', align: 'left' },
        { key: 'type', name: 'Type', align: 'left' },
        { key: 'status', name: 'Status', align: 'left', render: (cell, row) => this.renderStatusSelect(cell, row) }
    ]
    
    renderStatusSelect = (cell, row) => {
        return (
            <Select
                value={cell}
                onChange={(event) => this.handleStatusChange(event.target.value, row)}
            >
                <MenuItem value='unpaid'>unpaid</MenuItem>
                <MenuItem value='paid'>paid</MenuItem>
            </Select>
        )
    }
    
    handleStatusChange = (value, row) => {
        axios.post(
            `http://localhost:4000/bills/${row._id}/${userID}/update`, 
            { status: value }
        ).then(res => {
            console.log(res.data);
        });
        let temp = [...this.state.data];
        temp[row.index].status = value;
        this.setState({ data: temp });
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
                let status = "unfound";
                item.payments.forEach(userItem => {
                    if (userItem.userId === userID) {
                        status = userItem.status;
                    }
                });
                item.status = status;
            });
            this.setState({data: res.data});
        });
    }
    
    render() {
        return (   
            <div>
                <BillsTable 
                    columns={this.columns}
                    data={this.state.data}
                    requestDescSort={(event, property) => this.handleRequestSort(event, property)}
                    // defaultOrderBy='date'
                    // defaultOrder='desc'
                />
            </div>
        )
    }
}

export default PageDashboard

// TODO: when landing on page, check if there is a user logged in,
// If not, redirect them to login