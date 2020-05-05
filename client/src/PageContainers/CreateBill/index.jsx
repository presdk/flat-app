import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Checkbox } from '@material-ui/core';

import * as selectors from '../../redux/selectors';

import AppTable from '../../Components/table';

const columns = [
    { key: 'name', name: 'User', align: 'left' },
    { key: 'usage_in_days', name: 'Period', align: 'left' },
    { key: 'payable_amount', name: 'Amount', align: 'left', render: (cell, row) => { return `$${cell.toFixed(2)}` } }
]

class PageCreateBill extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            bill_details: null,
            users_details: null
        }
    }

    handleUserSelect = index => {
        let cpUsers = [...this.state.users_details];
        cpUsers[index].selected = !cpUsers[index].selected;
        this.setState({ users_details: cpUsers });
    }

    componentDidMount() {
        axios.get(`http://localhost:4000/bills/${this.props.location.state.bill_id}`).then(b_res => {
            axios.get('http://localhost:4000/users').then(u_res => { 
                var i = 0;
                let prebilled_users = [];
                b_res.data.payments.forEach(payment => {
                    payment.index = i;
                    i++;
                    prebilled_users.push(payment.userId);
                    const found_user = u_res.data.filter(user => {
                        return user._id === payment.userId
                    });
                    if (Array.isArray(found_user) && found_user.length) {
                        payment.name = found_user[0].name;
                    }
                });
                i = 0;
                u_res.data.forEach(user => {
                    user.index = i;
                    i++;
                    user.selected = prebilled_users.includes(user._id);
                });
                this.setState({ bill_details: b_res.data, users_details: u_res.data });
            });
        });
    }
    
    render() {
        if (this.state.bill_details) {
            const bill = {...this.state.bill_details};
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
                        {this.state.users_details.map(user => {
                            return (
                                <p key={user._id}>
                                    <Checkbox 
                                        checked={user.selected}
                                        onChange={() => this.handleUserSelect(user.index)}
                                    /> {user.name}
                                </p>
                            )
                        })}
                    </div>
                    <AppTable 
                        columns={columns}
                        data={bill.payments}
                    />
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

export default connect(mapStateToProps, mapDispatchToProps)(PageCreateBill)