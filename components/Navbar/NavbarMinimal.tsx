import { useState } from 'react';
import { useRouter } from 'next/router'; 
import Link from 'next/link';
import { Center, Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
import {
  IconHome2,
  IconTransform,
  IconHistory,
  IconUser,
  IconLogout,
} from '@tabler/icons-react';
import Image from 'next/image';
import classes from './NavbarMinimal.module.css';
import logo from '../../1762-rm.png';
import Cookies from 'js-cookie';
import axios from 'axios';
import keycloakConfig, { getLogoutEndpoint } from '../../util/keycloakConfig';




interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
  link: string;
}

function NavbarLink({ icon: Icon, label, active, onClick, link }: NavbarLinkProps) {
  return (
      <Link href={link} passHref>
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
          <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
            <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      </Link>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home', link: '/home' },
  { icon: IconTransform, label: 'Convert', link: '/convert' },
  { icon: IconHistory, label: 'History', link: '/history' },
];

export function NavbarMinimal() {
  const [active, setActive] = useState(0);
  const router = useRouter(); // Initialize useRouter hook

  const handleLogout = async () => {
    try {
      const idToken = Cookies.get('idToken') || '';
      const refreshToken = Cookies.get('refreshToken') || '';

      const params = new URLSearchParams({
        client_id: keycloakConfig.clientId,
        refresh_token: refreshToken,
        id_token_hint: idToken,
        post_logout_redirect_uri:keycloakConfig.redirectUri,
      });

      await axios.post(
          getLogoutEndpoint(),
          params.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
      );

      // Clean up cookies
      Cookies.remove('authToken');
      Cookies.remove('idToken');
      Cookies.remove('refreshToken');

      // Redirect to the home page
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const links = mockdata.map((link, index) => (
      <NavbarLink
          {...link}
          key={link.label}
          active={index === active}
          onClick={() => setActive(index)}
      />
  ));

  return (
      <nav className={classes.navbar}>
        <Center>
          <div className={classes.logoContainer}>
            <Image src={logo} alt="Attijariwafa Bank" width={60} height={45} />
          </div>
        </Center>

        <div className={classes.navbarMain}>
          <Stack justify="center" gap={0}>
            {links}
          </Stack>
        </div>

        <Stack justify="center" gap={0}>
          <NavbarLink icon={IconUser} label="Account Settings" link="/profil" />
          <UnstyledButton onClick={handleLogout} className={classes.link}>
            <IconLogout style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
          </UnstyledButton>
        </Stack>
      </nav>
  );
}

export default NavbarMinimal;
 