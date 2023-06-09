import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const RegistrationForm = () => {
  // initialize form state
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  // initialize validation state
  const [isFormValidated] = useState(false);

  // initialize alert state
  const [isAlertVisible, setAlertVisibility] = useState(false);

  // define the mutation for creating a user
  const [createUser, { error, returnedData }] = useMutation(CREATE_USER);

  // update form data state upon user input
  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Attempt to create a user with the form data. Upon success, log the user in.
      const { returnedData } = await createUser({
        variables: { ...formData },
      });

      Auth.login(returnedData.createUser.token);
    } catch (err) {
      console.error(err);
      setAlertVisibility(true);
    }

    // Reset form
    setFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={isFormValidated} onSubmit={handleSubmit}>
        <Alert dismissible onClose={() => setAlertVisibility(false)} show={isAlertVisible} variant='danger'>
          There was an issue with your registration!
        </Alert>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleUserInput}
            value={formData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleUserInput}
            value={formData.email}
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
            value={formData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(formData.username && formData.email && formData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default RegistrationForm;
