import {
  Avatar,
  Button,
  Divider,
  Menu,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { BrightnessHalf, Logout, Settings } from 'tabler-icons-react';

const ProfileMenu = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Menu
      control={
        <Button
          variant={dark ? 'subtle' : 'white'}
          styles={() => ({
            root: {
              color: dark ? '#d0cfd4' : '#3c4394',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',

              '&:hover': {
                backgroundColor: dark ? '#1a1b1e' : '',
              },
            },
          })}
        >
          <Text
            style={{ marginRight: '10px' }}
            styles={() => ({
              root: {
                '@media (max-width: 755px)': {
                  fontSize: 0,
                },
              },
            })}
          >
            Sean
          </Text>
          <Avatar radius='xl' color='indigo' />
        </Button>
      }
      styles={() => ({
        body: {
          width: '140px',
        },
      })}
    >
      <Menu.Item icon={<Settings size={14} />}>Account</Menu.Item>
      <Menu.Item
        icon={<BrightnessHalf size={14} />}
        onClick={() => toggleColorScheme()}
      >
        {dark ? 'Light' : 'Dark'} Mode
      </Menu.Item>

      <Divider />

      <Menu.Item color='red' icon={<Logout size={14} />}>
        Sign Out
      </Menu.Item>
    </Menu>
  );
};

export default ProfileMenu;
