import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const UserLoginForm = () => {
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [formValidated] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(false);

  const [performLogin, { error, response }] = useMutation(LOGIN_USER);

  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmission = async (event) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    if (formElement.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { response } = await performLogin({
        variables: { ...userData },
      });

      Auth.login(response.login.token);
    } catch (err) {
      console.error(err);
      setDisplayAlert(true);
    }

    setUserData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={formValidated} onSubmit={handleSubmission}>
        <Alert dismissible onClose={() => setDisplayAlert(false)} show={displayAlert} variant='danger'>
          There was an issue with your login details!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleUserInput}
            value={userData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleUserInput}
            value={userData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userData.email && userData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default UserLoginForm;
