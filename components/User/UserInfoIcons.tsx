import React, { useEffect, useState } from 'react';
import { Avatar, Text, Group, Card } from '@mantine/core';
import { IconPhoneCall, IconAt } from '@tabler/icons-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import classes from './UserInfoIcons.module.css';
import Image from 'next/image';
import logo from '../../icon.png';

interface UserInfo {
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export function UserInfoIcons() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const authToken = Cookies.get('authToken');
        const userID = Cookies.get('userID');

        if (!userID) {
          console.error('User ID is not available in cookies');
          return;
        }

        const response = await axios.get(`http://localhost:8081/userInfo`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          params: { userId: userID },
        });

        console.log('User Info:', response.data);
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info', error);
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <Card withBorder radius="md" padding="lg" shadow="md" className={classes.card}>
      <Group wrap="nowrap">
        <Avatar
          src={logo.src}
          size={94}
          radius="md"
        />
        <div>
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            {userInfo.role || 'User'}
          </Text>

          <Text fz="lg" fw={500} className={classes.name}>
            {userInfo.name}
          </Text>

          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {userInfo.email}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {userInfo.phone || 'No phone provided'}
            </Text>
          </Group>
        </div>
      </Group>
    </Card>
  );
}
