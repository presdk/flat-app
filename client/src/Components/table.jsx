import React from 'react';
import { 
    TableContainer, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    TableSortLabel
} from '@material-ui/core';

class BillsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderBy: this.props.defaultOrderBy,
            order: this.props.defaultOrder
        }
    }

    createSortHandler = (property) => (event) => {
        this.props.requestSort(event, property);
    }

    columnNames = () => {
        return this.props.columns.map(column => {
            return (
                <TableCell  
                    key={column.name}
                    align={column.align}
                    sortDirection={this.state.orderBy === column.name ? this.state.order : false}
                >
                    <TableSortLabel
                        active={this.state.orderBy === column.name}
                        direction={this.state.orderBy === column.name ? this.state.order : 'desc'}
                        onClick={this.createSortHandler(column.name)}
                    >
                        {column.name}
                    </TableSortLabel>
                </TableCell>
            )
        })
    }

    tableData = () => {
        return null
    }

    render() {
        return (
            <TableContainer>
                <Table stickyHeader size='small'>
                    <TableHead>
                        <TableRow>
                            {this.columnNames()}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.tableData()}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default BillsTable