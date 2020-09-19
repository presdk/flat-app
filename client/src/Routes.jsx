import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as selectors from './redux/selectors';

import PageDashboard from './PageContainers/Dashboard';
import PageLogin from './PageContainers/Login';
import PageCreateBill from './PageContainers/CreateBill';
import PageViewBill from './PageContainers/ViewBill';

class PageRoutes extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    render() {
        return (
            <div style={{
                minWidth: '350px',
                width: '50%',
                margin: 'auto'
            }}>
                {this.props.currentUser == null ? <Redirect to='/login' /> : null}
                <Route exact path='/' component={PageDashboard} />
                <Route exact path='/login' component={PageLogin} />
                <Route exact path='/create-bill' component={PageCreateBill} />
                <Route exact path='/bill' component={PageViewBill} />
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(PageRoutes);