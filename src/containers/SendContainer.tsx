import React from 'react';
import * as H from 'history';
import { connect } from 'react-redux';
import { requestStatus } from '../constants';
import AccessForm from '../components/access-form';
import Layout from '../components/layout';
import SendForm from '../components/send-form';

interface IProps {
  history: H.History;
  location: H.Location;
  authStatus?: string;
}

class SendContainer extends React.Component<IProps, {}> {
  public render() {
    const { authStatus } = this.props;
    const isAuth = authStatus === requestStatus.SUCCEED;
    return (
      <div>
        <Layout>
          <div style={{ padding: 25 }}>{isAuth ? <SendForm /> : <AccessForm />}</div>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authStatus: state.zil.authStatus
});

export default connect(mapStateToProps)(SendContainer);
