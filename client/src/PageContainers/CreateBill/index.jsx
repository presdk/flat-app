import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Button, Checkbox, Select, MenuItem } from '@material-ui/core';

import * as selectors from '../../redux/selectors';

import AppTable from '../../Components/table';
import userPageHoc from "../../hocs/userPage";

class PageCreateBill extends React.Component {
    constructor() {
        super();
        this.state={
            bill_details: null,
            disp_data: null
        }
    }

    columns = [
        { key: 'name', name: 'User', align: 'left' },
        { key: 'usage_in_days', name: 'Period', align: 'left', render: (cell, row) => {return (row.key !== 'total') ? 
            <Select 
                value={cell}
                onChange={(event) => this.handleRatioUpdate(event.target.value, row.index)}
            >
                {[...Array(32).keys()].map(i => {
                    return (<MenuItem key={i} value={i}>{i}</MenuItem>)
                })}
            </Select>
        :
            cell
        } },
        { key: 'payable_amount', name: 'Amount', align: 'left', render: (cell, row) => { return `$${cell.toFixed(2)}` } }
    ]
    onPublishClicked = () => {
        axios.post(`http://localhost:4000/bills/${this.props.location.state.bill_id}/update`, { is_admin_confirmed: true })
        .then(data => {
            this.props.history.goBack();
        })
        .catch(err => {
            alert(`An error occurred with the following reason: ${err.message}`);
        });
    }

    handleUserSelect = index => {
        let cpDisp = [...this.state.disp_data];
        cpDisp[index].is_selected = !cpDisp[index].is_selected;
        this.setState({ disp_data: this.calculatePayable(cpDisp) });
    }

    handleRatioUpdate = (value, index) => {
        let cpDisp = [...this.state.disp_data];
        cpDisp[index].usage_in_days = value;
        this.setState({ disp_data: this.calculatePayable(cpDisp) });
    }

    calculatePayable = users => {
        let cpUsers = [...users]
        let denom = 0;
        cpUsers.forEach(user => {
            if (user.is_selected) {
                denom += user.usage_in_days;
            }
        })
        cpUsers.forEach(user => {
            if (user.is_selected && (denom !== 0)) {
                user.payable_amount = this.state.bill_details.total_amount * user.usage_in_days / denom;
            } else {
                user.payable_amount = 0;
            }
        })
        return cpUsers
    }

    getTotals = data => {
        let total_usage = 0;
        let total_amount = 0;
        data.forEach(user => {
            total_usage += user.usage_in_days;
            // The following is calulated this way to return to the adminh an amount that does not cause confusion about an unexplainable cent
            total_amount += parseFloat(user.payable_amount.toFixed(2));
        });
        data.push({
            key: 'total',
            _id: 'total',
            name: 'Total',
            usage_in_days: total_usage,
            payable_amount: total_amount
        });
        return data
    }

    componentDidMount() {
        axios.get(`http://localhost:4000/bills/${this.props.location.state.bill_id}`).then(b_res => {
            axios.get('http://localhost:4000/users').then(u_res => { 
                let temp = {};
                u_res.data.forEach(user => {
                    temp[user._id] = {
                        key: user._id,
                        name: user.name,
                        usage_in_days: 0,
                        payable_amount: 0,
                        is_selected: false
                    }
                });
                b_res.data.payments.forEach(payment => {
                    temp[payment.userId] = {...temp[payment.userId], ...payment, is_selected: true}
                })
                var index = 0;
                const disp_data = Object.keys(temp).map(user_id => {
                    temp[user_id].index = index;
                    index++;
                    return temp[user_id]
                })
                this.setState({ bill_details: b_res.data, disp_data: disp_data });
            });
        });
    }
    
    render() {
        if (this.state.bill_details) {
            const bill = {...this.state.bill_details};
            const disp = [...this.state.disp_data];
            return (
                <div>
                    <p>
                        {bill.type} - {bill.reference_name} <br/>
                        {bill.date}
                    </p>
                    <p>
                        Total Amount: <br/>
                        {bill.total_amount}
                    </p>
                    <p>
                        <a href='http://localhost:4000' target='_blank' rel="noopener noreferrer">See original</a>
                    </p> 
                    <div>
                        {disp.map(user => {
                            return (
                                <p key={user.key}>
                                    <Checkbox 
                                        checked={user.is_selected}
                                        onChange={() => this.handleUserSelect(user.index)}
                                    /> {user.name}
                                </p>
                            )
                        })}
                    </div>
                    <AppTable 
                        columns={this.columns}
                        data={this.getTotals(disp.filter(entry => {
                            return entry.is_selected === true
                        }))}
                    />
                    <Button
                        color='primary'
                        onClick={() => this.onPublishClicked()}
                    >
                        Publish Bill
                    </Button>
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
        currentUser: selectors.getUser(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(userPageHoc(PageCreateBill))