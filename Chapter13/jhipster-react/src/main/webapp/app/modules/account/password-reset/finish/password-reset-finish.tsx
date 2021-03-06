import * as React from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Row, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { Link } from 'react-router-dom';

import { handlePasswordResetFinish, reset } from '../password-reset.reducer';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';

const actionRequiredAlert = (
  <Alert color="warning">
    <Translate contentKey="reset.finish.messages.info" />
  </Alert>
);

const successAlert = (
  <Alert color="success">
    <Translate contentKey="reset.finish.messages.success" />{' '}
    <Link className="alert-link" to="/login">
      <Translate contentKey="global.messages.info.authenticated.link" />
    </Link>.
  </Alert>
);

const errorAlert = (
  <Alert color="danger">
    <Translate contentKey="reset.finish.messages.error" />
  </Alert>
);

const missingArgAlert = (
  <Alert color="danger">
    <Translate contentKey="reset.finish.messages.keymissing" />
  </Alert>
);

export interface IPasswordResetFinishProps {
  resetPasswordSuccess: boolean;
  resetPasswordFailure: boolean;
  handlePasswordResetFinish: Function;
  reset: Function;
  match: any;
}

export interface IPasswordResetFinishState {
  password: string;
  key: string;
}

export class PasswordResetFinishPage extends React.Component<IPasswordResetFinishProps, IPasswordResetFinishState> {
  state: IPasswordResetFinishState = {
    password: '',
    key: this.props.match.params.key
  };

  componentWillUnmount() {
    this.props.reset();
  }

  handleValidSubmit = (event, values) => {
    this.props.handlePasswordResetFinish(this.state.key, values.newPassword);
  };

  updatePassword = event => {
    this.setState({ password: event.target.value });
  };

  getResetForm() {
    return (
      <AvForm onValidSubmit={this.handleValidSubmit}>
        <AvField
          name="newPassword"
          label={<Translate contentKey="global.form.newpassword" />}
          placeholder={translate('global.form.newpassword.placeholder')}
          type="password"
          validate={{
            required: { value: true, errorMessage: translate('global.messages.validate.newpassword.required') },
            minLength: { value: 4, errorMessage: translate('global.messages.validate.newpassword.minlength') },
            maxLength: { value: 50, errorMessage: translate('global.messages.validate.newpassword.maxlength') }
          }}
          onChange={this.updatePassword}
        />
        <PasswordStrengthBar password={this.state.password} />
        <AvField
          name="confirmPassword"
          label={<Translate contentKey="global.form.confirmpassword" />}
          placeholder={translate('global.form.confirmpassword.placeholder')}
          type="password"
          validate={{
            required: { value: true, errorMessage: translate('global.messages.validate.confirmpassword.required') },
            minLength: { value: 4, errorMessage: translate('global.messages.validate.confirmpassword.minlength') },
            maxLength: { value: 50, errorMessage: translate('global.messages.validate.confirmpassword.maxlength') },
            match: { value: 'newPassword', errorMessage: translate('global.messages.error.dontmatch') }
          }}
        />
        <Button color="success" type="submit">
          <Translate contentKey="reset.finish.form.button" />
        </Button>
      </AvForm>
    );
  }

  render() {
    const { key } = this.state;
    const { resetPasswordSuccess, resetPasswordFailure } = this.props;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="4">
            <h1>
              <Translate contentKey="reset.finish.title" />
            </h1>
            {key ? actionRequiredAlert : null}
            {!resetPasswordSuccess && !resetPasswordFailure && !key ? missingArgAlert : null}
            {resetPasswordSuccess ? successAlert : null}
            {resetPasswordFailure ? errorAlert : null}
            <div>{key ? this.getResetForm() : null}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = ({ passwordReset }) => ({
  resetPasswordSuccess: passwordReset.resetPasswordSuccess,
  resetPasswordFailure: passwordReset.resetPasswordFailure
});

const mapDispatchToProps = { handlePasswordResetFinish, reset };

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetFinishPage);
