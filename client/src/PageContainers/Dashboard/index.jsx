import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    Backdrop,
    CircularProgress,
    ExpansionPanel, 
    ExpansionPanelSummary, 
    ExpansionPanelDetails 
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import * as selectors from '../../redux/selectors';

import AppTable from '../../Components/table';
import StatusSelector from '../../Components/statusSelector';

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
    if (a.payments[0]['status'] > b.payments[0]['status']) {
        return -1
    } else if (a.payments[0]['status'] < b.payments[0]['status']) {
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

function groupBy(list, props) {
    return list.reduce((a, b) => {
       (a[b[props]] = a[b[props]] || []).push(b);
       return a;
    }, {});
  }

class PageDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            loading: true,
            data: {}
        }
    }

    unconfirmed_columns = (this.props.user && this.props.user.type === 'admin') ? [
        { key: 'date', name: 'Date', align: 'left', render: (cell, row) => this.renderBillRedirect('create', cell, row) },
        { key: 'type', name: 'Type', align: 'left' },
        { key: 'total_amount', name: 'Billed', align: 'left' }
    ] : [
        { key: 'date', name: 'Date', align: 'left' },
        { key: 'type', name: 'Type', align: 'left' },
        { key: 'total_amount', name: 'Billed', align: 'left' }
    ]

    confirmed_columns = [
        { key: 'date', name: 'Date', align: 'left', render: (cell, row) => this.renderBillRedirect('view', cell, row) },
        { key: 'type', name: 'Type', align: 'left' },
        { key: 'payments', name: 'Status', align: 'left', render: (cell, row) => this.renderStatusSelect(cell, row) }
    ]

    renderBillRedirect = (page, cell, row) =>{
        return (
            <Link to={{
                pathname: (page === 'view') ? '/bill' : '/create-bill',
                state: {bill_id: row._id}
            }}>
                {cell}
            </Link>
        )
    } 
    
    renderStatusSelect = (cell, row) => {
        return cell.map(payment => {
            return (
                <StatusSelector 
                    user_type={this.props.user.type}
                    payment={payment}
                    handleStatusChange={(new_val, user_id) => this.handleStatusChange(new_val, user_id, row)}
                />
            )
        })
    }
    
    handleStatusChange = (new_value, user_id, row) => {
        axios.post(
            `http://localhost:4000/bills/${row._id}/${user_id}/update`, 
            { status: new_value }
        )
    }

    handleRequestSort = (event, property) => {
        switch(property) {
            case 'date':
                return sortByDate
            case 'type':
                return sortByType
            case 'payments':
                return sortByStatus
            default:
                return sortByDate
        }
    };

    componentDidMount() {
        axios.get('http://localhost:4000/bills').then(b_res => {
            axios.get('http://localhost:4000/users').then(u_res => {
                var i = 0;
                if (this.props.user && (this.props.user.type === 'user')) {
                    b_res.data.forEach(item => {
                        item.index = i;
                        i++;
                        item.payments.forEach(userItem => {
                            if (userItem.userId === this.props.user._id) {
                                item.payments = [userItem];
                            }
                        });
                    });
                } else {
                    b_res.data.forEach(item => {
                        item.payments.forEach(userItem => {
                            const found_user = u_res.data.filter(user => {
                                return user._id === userItem.userId
                            });
                            if (Array.isArray(found_user) && found_user.length) {
                                userItem.name = found_user[0].name;
                            }
                        })
                    });
                }
                this.setState({ loading: false, data: groupBy(b_res.data, 'is_admin_confirmed') });
            })
        });
    }
    
    render() {
        return (   
            <div>
                <Backdrop open={this.state.loading} style={{ zIndex: 1000 }}>
                    <CircularProgress color="primary" />
                </Backdrop>
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        Unpublished Bills ({this.state.loading ? 'loading' : (this.state.data.false ? this.state.data.false.length : 0)})
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <AppTable 
                            columns={this.unconfirmed_columns}
                            data={this.state.data.false}
                            sorter={true}
                            requestDescSort={(event, property) => this.handleRequestSort(event, property)}
                        />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <div style={{ marginTop: '24px' }}>
                    <AppTable 
                        columns={this.confirmed_columns}
                        data={this.state.data.true}
                        sorter={true}
                        requestDescSort={(event, property) => this.handleRequestSort(event, property)}
                    />
                </div>
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