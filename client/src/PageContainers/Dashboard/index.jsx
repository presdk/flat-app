import React from 'react';

import BillsTable from '../../Components/table';

const columns = [
    { name: 'Date', align: 'left' },
    { name: 'Type', align: 'left' },
    { name: 'Amount', align: 'left' },
    { name: 'Status', align: 'left' }
]

class PageDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            
        }
    }

    handleRequestSort = (event, property) => {
        console.log(event);
        console.log(property);
    };
    
    render() {
        return (   
            <div>
                <BillsTable 
                    columns={columns}
                    requestSort={(event, property) => this.handleRequestSort(event, property)}
                    defaultOrderBy='Date'
                    defaultOrder='desc'
                />
            </div>
        )
    }
}

export default PageDashboard

// TODO: when landing on page, check if there is a user logged in,
// If not, redirect them to login