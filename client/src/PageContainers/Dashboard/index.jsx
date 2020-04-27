import React from 'react';
import axios from 'axios';

import BillsTable from '../../Components/table';

const columns = [
    { key: 'date', name: 'Date', align: 'left' },
    { key: 'type', name: 'Type', align: 'left' },
    { key: 'status', name: 'Status', align: 'left' }
]

/*ABOUT: What does the data look like?
    date is in the format of "dd-mm-yy"
    type is either "water"/"power"/"internet"/"misc"
    status is either "unpaid"/"marked"/"paid" converted to "pending"/"paid"/"confirmed"
*/

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
    if (a['payment']['status'] > b['payment']['status']) {
        return -1
    } else if (a['status'] < b['status']) {
        return 1
    } else {
        return sortByType(a, b)
    }
}

class PageDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data: []
        }
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
        axios.get('localhost:4000/bills').then(res => {
            console.log('something')
            console.log(res.data);
            this.setState({data: res.data});
        })
    }
    
    render() {
        return (   
            <div>
                <BillsTable 
                    columns={columns}
                    data={[
                        {
                            date: '01-01-19', type: 'water', status: 'paid'
                        },{
                            date: '01-01-20', type: 'internet', status: 'unpaid'
                        },{
                            date: '01-02-19', type: 'power', status: 'marked'
                        },{
                            date: '02-01-19', type: 'water', status: 'paid'
                        }
                    ]}
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