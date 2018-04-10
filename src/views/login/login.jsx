import React from 'react';
import { connect } from 'react-redux';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import BaseComponent from '../../common/BaseComponent.jsx';

import './loginStyle.less';

const FormItem = Form.Item;

class Login extends BaseComponent {

  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.loginFun(values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div className="login">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登 录
              </Button>
            </FormItem>
          </Form>
        </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(Login);

export default connect(
    (state) => {
      return {
        logined: state.getIn(['loginReducers', 'logined'])
      }
    },
    (dispatch) => {
      return {
        loginFun: (value) => {
          dispatch({ type: 'LOGIN_REQUEST', value: value });
        }
      }
    }
)(WrappedNormalLoginForm);