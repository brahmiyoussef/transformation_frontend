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
import keycloakConfig, { getLogoutEndpoint ,getRevokeEndpoint} from '../../util/keycloakConfig';

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
    const [refreshIntervalId, setRefreshIntervalId] = useState<number | null>(null); // Store interval ID

    const handleLogout = async () => {
        try {
            const refreshToken = Cookies.get('refreshToken') || '';

            if (refreshToken) {
                console.log('Attempting to revoke refresh token...');

                const params = new URLSearchParams({
                    client_id: keycloakConfig.clientId,
                    token: refreshToken,
                    token_type_hint: 'refresh_token',
                });

                await axios.post(
                    getRevokeEndpoint(),
                    params.toString(),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );

                console.log('Refresh token revocation request sent');
            }

            // Clear the token refresh interval
            if (refreshIntervalId) {
                clearInterval(refreshIntervalId);
                console.log('Token refresh interval cleared');
            }

            // Remove tokens from cookies
            Cookies.remove('authToken');
            Cookies.remove('idToken');
            Cookies.remove('refreshToken');

            // Redirect to the login page
            await router.push('/');
        } catch (error) {
            console.error('Failed to revoke refresh token', error);
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
 