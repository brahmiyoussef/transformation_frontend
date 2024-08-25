import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import keycloakConfig, { getLogoutEndpoint } from '../../util/keycloakConfig';

export const handleLogout = async () => {
  const router = useRouter();

  try {
    const idToken = Cookies.get('idToken');
    const refreshToken = Cookies.get('refreshToken');

    const params = new URLSearchParams();
    params.append('client_id', keycloakConfig.clientId);
    if (refreshToken) {
      params.append('refresh_token', refreshToken);
    }
    if (idToken) {
      params.append('id_token_hint', idToken);
    }
    params.append('post_logout_redirect_uri', keycloakConfig.redirectUri);

    await axios({
      method: 'post',
      url: getLogoutEndpoint(),
      data: params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true,
    });

    // Remove cookies after successful logout
    Cookies.remove('authToken');
    Cookies.remove('idToken');
    Cookies.remove('refreshToken');

    // Redirect to the specified URI after logout
    router.push(keycloakConfig.redirectUri);
  } catch (error) {
    console.error('Logout failed', error);
  }
};
