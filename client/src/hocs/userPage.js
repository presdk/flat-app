
import React from "react";
import { Redirect } from 'react-router-dom';

export default function userPageHoc(Page) {
    return class UserPage extends React.Component {
        render() {
            if (this.props.currentUser == null) {
                return <Redirect to="/login" />
            }

            return <Page {...this.props} />;
        }
    }
}