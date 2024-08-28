import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
} from '@mantine/core';
import classes from './AuthenticationImage.module.css';
import keycloakConfig, { getTokenEndpoint } from '../../util/keycloakConfig';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      params.append('client_id', keycloakConfig.clientId);
      params.append('username', username);
      params.append('password', password);
      params.append('grant_type', 'password');
      params.append('scope', 'openid'); // Include openid scope to get id_token

      const response = await axios.post(getTokenEndpoint(), params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, id_token, refresh_token } = response.data;
      console.log("Login response:", response.data);
      Cookies.set('authToken', access_token);
      Cookies.set('idToken', id_token);
      Cookies.set('refreshToken', refresh_token);

      // Additional request to get user details
      const userResponse = await axios.post(
          'http://localhost:8081/api/convert/login',
          new URLSearchParams({ Authorization: `Bearer ${access_token}` }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${access_token}`,
            },
          }
      );
      console.log('User details response:', userResponse.data);
      Cookies.set('userID', userResponse.data.id);
      Cookies.set('userrole', userResponse.data.role);

      // Start the token refresh interval
      startTokenRefreshInterval();

      router.push('/home');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const refreshToken = async () => {
    try {
      console.log('Attempting to refresh token...');

      const refresh_token = Cookies.get('refreshToken');
      if (!refresh_token) {
        console.error('No refresh token found');
        return;
      }

      console.log('Refresh token found:', refresh_token);

      const params = new URLSearchParams();
      params.append('client_id', keycloakConfig.clientId);
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', refresh_token);

      const response = await axios.post(getTokenEndpoint(), params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, id_token, refresh_token: newRefreshToken } = response.data;
      console.log('Token refreshed successfully:', response.data);

      // Update tokens in cookies
      Cookies.set('authToken', access_token);
      Cookies.set('idToken', id_token);
      Cookies.set('refreshToken', newRefreshToken);

      console.log('Tokens updated in cookies');
    } catch (error) {
      console.error('Failed to refresh token', error);
    }
  };

  const startTokenRefreshInterval = () => {
    setInterval(refreshToken, 30000); // Refresh every 30 minutes
  };

  return (
      <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={30}>
          <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
            Welcome back to Attijariwafa Bank!
          </Title>

          <form onSubmit={handleLogin}>
            <TextInput
                label="Username"
                placeholder="Your username"
                size="md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <PasswordInput
                label="Password"
                placeholder="Your password"
                mt="md"
                size="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <Button fullWidth mt="xl" size="md" type="submit" style={{ backgroundColor: '#f8e8c6', color: '#ed5f49' }}>
              Login
            </Button>
          </form>
        </Paper>
      </div>
  );
};

export default Login;
 