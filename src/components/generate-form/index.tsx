import React from 'react';
import { Card, Label, Input, FormGroup, Form, Row, Col } from 'reactstrap';
import { PASSPHRASE_REGEX } from '../../regex';
import FormFeedback from 'reactstrap/lib/FormFeedback';
import Button from '../button';
import Steps, { Step } from 'rc-steps';

// @ts-ignore
import Worker from '../../encrypt.worker';

import Spinner from '../spinner';
import { getInputValidationState, downloadObjectAsJson } from '../../utils';
import { requestStatus } from '../../constants';

const FIRST_STEP = 0;
const SECOND_STEP = 1;
const FINAL_STEP = 2;

interface IState {
  passphrase: string;
  passphraseValid: boolean;
  passphraseInvalid: boolean;
  keystoreJSON?: string;
  currentStep: number;
  encryptStatus?: string;
  privateKey?: string;
}

class GenerateForm extends React.Component<{}, IState> {
  public worker;
  public readonly state: IState = {
    passphrase: '',
    passphraseValid: false,
    passphraseInvalid: false,
    encryptStatus: undefined,
    keystoreJSON: undefined,
    privateKey: undefined,
    currentStep: FIRST_STEP
  };

  public componentDidMount() {
    this.worker = new Worker();

    this.worker.onmessage = (event) => {
      const { keystoreJSON, privateKey } = event.data;
      if (keystoreJSON === undefined || privateKey === undefined) {
        return this.setState({
          encryptStatus: requestStatus.FAILED
        });
      }
      this.setState(
        {
          keystoreJSON,
          privateKey
        },
        this.downloadKeystore
      );
    };
  }
  public render() {
    const { currentStep } = this.state;
    return (
      <div>
        <Card>
          <div className="py-5">
            <Row>
              <Col xs={11} sm={11} md={10} lg={8} className="mr-auto ml-auto">
                <Steps size="small" current={currentStep}>
                  <Step title="Passphrase" />
                  <Step title="Keystore" />
                  <Step title="Complete" />
                </Steps>
              </Col>
              <Col xs={10} sm={10} md={8} lg={7} className="mr-auto ml-auto">
                {currentStep === FIRST_STEP ? this.renderPassphraseStep() : null}
                {currentStep === SECOND_STEP ? this.renderKeystoreStep() : null}
                {currentStep === FINAL_STEP ? this.renderFinalStep() : null}
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    );
  }

  private renderPassphraseStep = () => {
    const { passphraseValid } = this.state;
    return (
      <div>
        <div className="text-center">
          <h2 className="pt-5">
            <b>{'Set Passphrase for your Keystore File'}</b>
          </h2>
          <p className="text-secondary py-3">
            {`This is your first step in creating your Klaytn Wallet.`}
            <br />
            {`Please set the password for the keystore file for your new wallet.`}
          </p>
        </div>
        <div>
          <Form className="mt-4">
            <FormGroup>
              <Label for="Passphrase">
                <small>
                  <b>{'Passphrase'}</b>
                </small>
              </Label>
              <Input
                id="passphrase"
                type="password"
                name="passphrase"
                data-test-id="passphrase"
                value={this.state.passphrase}
                onChange={this.changePassphrase}
                valid={this.state.passphraseValid}
                invalid={this.state.passphraseInvalid}
                placeholder="Enter the passphrase"
                maxLength={32}
                minLength={8}
              />
              <FormFeedback>{'invalid passphrase'}</FormFeedback>
              <FormFeedback valid={true}>{'valid passphrase'}</FormFeedback>
            </FormGroup>
            <div className="py-4 text-center">
              <Button
                text={'Confirm'}
                type="primary"
                ariaLabel={'Confirm'}
                onClick={() => this.setState({ currentStep: SECOND_STEP })}
                disabled={!passphraseValid}
              />
            </div>
          </Form>
        </div>
      </div>
    );
  };

  private renderFinalStep = () => {
    return (
      <div>
        <div className="text-center">
          <h2 className="pt-5">
            <b>{'Please Save your Private Key'}</b>
          </h2>
          <p className="text-secondary py-3">
            {`Your new wallet has been created.`}
            <br />
            {`Make sure to COPY the private key below and SAVE it.`}
          </p>
        </div>

        <br />
        <small>
          <b>Private Key</b>
        </small>
        <p className="text-primary py-3">
          <code className="text-primary">{this.state.privateKey}</code>
        </p>
      </div>
    );
  };

  private renderKeystoreStep = () => {
    const { encryptStatus } = this.state;
    const isPending = encryptStatus === requestStatus.PENDING;
    const buttonText = isPending ? 'Generating Keystore File' : 'Generate Keystore File';
    return (
      <div>
        <div className="text-center">
          <h2 className="pt-5">
            <b>{'Generate Keystore File'}</b>
          </h2>
          <p className="text-secondary py-3">
            {`The password for your keystore file for a new wallet has been set. Please click the tab below to generate your keystore to setup your wallet and move on to the last step.`}
          </p>
        </div>
        <div className="py-4 text-center">
          <Button
            text={buttonText}
            type="primary"
            ariaLabel={buttonText}
            onClick={this.generateKeystore}
            before={
              isPending ? (
                <span className="pr-1">
                  <Spinner size="small" />
                </span>
              ) : null
            }
            disabled={isPending}
          />
        </div>
      </div>
    );
  };

  private generateKeystore = () => {
    const { passphrase } = this.state;
    this.setState({ encryptStatus: requestStatus.PENDING }, () =>
      this.worker.postMessage({ passphrase })
    );
  };

  private downloadKeystore = () => {
    const keystoreJSON = this.state.keystoreJSON;
    if (typeof keystoreJSON !== 'string') {
      return;
    }
    const keystoreObject = JSON.parse(keystoreJSON);
    const filename = `zilliqa_keystore_${new Date().toISOString()}`;
    this.setState(
      {
        encryptStatus: requestStatus.SUCCEED,
        currentStep: FINAL_STEP
      },
      () => downloadObjectAsJson(keystoreObject, filename)
    );
  };

  private changePassphrase = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const value = e.target.value;
    const key = 'passphrase';
    const regex = PASSPHRASE_REGEX;
    const validationResult = getInputValidationState(key, value, regex);
    this.setState({ ...validationResult, [key]: value });
  };
}

export default GenerateForm;
