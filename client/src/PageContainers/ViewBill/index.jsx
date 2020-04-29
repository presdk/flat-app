import React from 'react';
import axios from 'axios';

class PageViewBill extends React.Component {
    constructor(props) {
        super(props);
        this.state={

        }
        console.log(this.props.location.state.bill_id);
        axios.get(`http://localhost:4000/bills/${this.props.location.state.bill_id}`).then(res => {
            console.log(res.data);
        });
    }
    
    render() {
        return (
            <div>View a specific bill by ID here</div>
        )
    }
}

export default PageViewBill