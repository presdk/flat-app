import React from 'react';
import { Select, MenuItem } from '@material-ui/core';

class StatusSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const payment = this.props.payment;
        return (
            <div>
                {(this.props.user_type === 'user') ?
                    ((payment.status !== 'paid') ?
                        <Select
                            key={payment.userId}
                            defaultValue={payment.status}
                            onChange={event => this.props.handleStatusChange(event.target.value, payment.userId)}
                        >
                            <MenuItem value='unpaid'>unpaid</MenuItem>
                            <MenuItem value='marked'>marked</MenuItem>
                        </Select>
                    :
                        'Paid'
                    )
                : 
                    <span>
                        {payment.name}: {(payment.status !== 'paid') ?
                            <Select
                                key={payment.userId}
                                defaultValue={payment.status}
                                onChange={event => this.props.handleStatusChange(event.target.value, payment.userId)}
                            >
                                <MenuItem value={payment.status}>{payment.status}</MenuItem>
                                <MenuItem value='paid'>Paid</MenuItem>
                            </Select>
                        :
                            (this.props.override ? 
                                <Select
                                    key={payment.userId}
                                    defaultValue={payment.status}
                                    onChange={event => this.props.handleStatusChange(event.target.value, payment.userId)}
                                >
                                    <MenuItem value='unpaid'>Unpaid</MenuItem>
                                    <MenuItem value='marked'>Marked</MenuItem>
                                    <MenuItem value='paid'>Paid</MenuItem>
                                </Select>
                            :
                                'Paid'
                            )
                        }
                    </span>
                }<br/>
            </div>
        )
    }
}

export default StatusSelector