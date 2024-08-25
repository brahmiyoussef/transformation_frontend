

const keycloakConfig = {
    baseUrl: 'http://localhost:8080', 
    realm: 'test2',
    clientId: 'test2',
    redirectUri: 'http://localhost:3000/login', 
  };
  
export const getTokenEndpoint = () => `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
export const getLogoutEndpoint = () => `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`;

  
  export { keycloakConfig as default };
  