

const keycloakConfig = {
  baseUrl: 'http://localhost:8080', 
  realm: 'ASI',
  clientId: 'asi',
  redirectUri: 'http://localhost:3000/login', 
};

export const getTokenEndpoint = () => `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
export const getLogoutEndpoint = () => `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`;
export const getRevokeEndpoint = () => `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/revoke`;


export { keycloakConfig as default };
