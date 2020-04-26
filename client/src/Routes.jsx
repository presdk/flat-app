import React from 'react';
import { Route } from 'react-router-dom';

import PageDashboard from './PageContainers/Dashboard';
import PageLogin from './PageContainers/Login';
import PageCreateBill from './PageContainers/CreateBill';
import PageViewBill from './PageContainers/ViewBill';

class PageRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    
    render() {
        return (
            <div>
                <Route exact path='/' component={PageDashboard}/>
                <Route exact path='/login' component={PageLogin}/>
                <Route exact path='/create-bill' component={PageCreateBill}/>
                <Route exact path='/bill' component={PageViewBill}/>
            </div>
        )
    }
}

export default PageRoutes;