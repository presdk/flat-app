import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { 
    ExpansionPanel, 
    ExpansionPanelSummary, 
    ExpansionPanelDetails,
    Select,
    MenuItem
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AppTable from '../../Components/table';

import * as selectors from '../../redux/selectors';

const columns = [
    { key: 'name', name: 'User', align: 'left' },
    { key: 'usage_in_days', name: 'Period', align: 'left' },
    { key: 'ratio', name: 'Ratio', align: 'left', render: (cell, row) => { return `${cell.toFixed(1)}%` } },
    { key: 'payable_amount', name: 'Amount', align: 'left', render: (cell, row) => { return `$${cell.toFixed(2)}` } }
]

class PageViewBill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bill_details: null
        }
    }

    handleStatusUpdate = value => {
        axios.post(
            `http://localhost:4000/bills/${this.state.bill_details._id}/${this.props.user._id}/update`, 
            { status: value }
        )
    }

    componentDidMount() {
        axios.get(`http://localhost:4000/bills/${this.props.location.state.bill_id}`).then(b_res => {
            axios.get('http://localhost:4000/users').then(u_res => { 
                let total_days = 0;
                let total_amount = 0;
                let total_ratio = 0;
                b_res.data.payments.forEach(item => {
                    total_days += item.usage_in_days;
                    total_amount += item.payable_amount;
                    const found_user = u_res.data.filter(user => {
                        return user._id === item.userId
                    })
                    if (Array.isArray(found_user) && found_user.length) {
                        item.name = found_user[0].name;
                    }
                });
                b_res.data.payments.forEach(item => {
                    item.ratio = item.usage_in_days/total_days * 100;
                    total_ratio += item.ratio;
                });
                b_res.data.payments.push({ name: 'Total', usage_in_days: total_days, ratio: total_ratio, payable_amount: total_amount });
                this.setState({ bill_details: b_res.data });
            });
        });
    }
    
    render() {
        if (this.state.bill_details) {
            const bill = {...this.state.bill_details};
            const user = {...this.props.user}
            let extract = null;
            bill.payments.forEach(item => {
                if (item.userId === user._id) {
                    extract = item;
                }
            });
            return (
                <div>
                    <p>
                        {bill.type} - {bill.reference_name} <br/>
                        {bill.date}
                    </p>
                    <p>
                        Amount due: <br/>
                        {extract ? `$${extract.payable_amount.toFixed(2)}` : '$0.00'}
                    </p>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            Show details
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div>
                                <div>Splits from ${bill.total_amount}</div>
                                <div>
                                    <AppTable 
                                        columns={columns}
                                        data={bill.payments}
                                    />
                                </div>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <p>
                        <a href='http://localhost:4000' target='_blank' rel="noopener noreferrer">See original</a>
                    </p>
                    <Select
                        defaultValue={extract.status}
                        onChange={event => this.handleStatusUpdate(event.target.value)}
                    >
                        <MenuItem value='unpaid'>unpaid</MenuItem>
                        <MenuItem value='paid'>paid</MenuItem>
                    </Select>
                </div>
            )
        } else {
            return (
                <div>
                    {"<Loading bill> => <Timeout error>"}
                </div>
            )
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(PageViewBill)