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

const SendContainer: React.FunctionComponent<IProps> = (props) => {
  const { authStatus } = props;
  const isAuth = authStatus === requestStatus.SUCCEED;
  return (
    <div>
      <Layout>
        <div className="p-4">
          {isAuth ? (
            <SendForm />
          ) : (
            <div>
              <span className="pl-1 text-secondary">Send ZIL</span>
              <AccessForm />
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state) => ({
  authStatus: state.zil.authStatus
});

export default connect(mapStateToProps)(SendContainer);
