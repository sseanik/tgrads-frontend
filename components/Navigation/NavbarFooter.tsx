import {
  Avatar,
  Box,
  Group,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { ChevronRight } from 'tabler-icons-react';

const NavbarFooter = () => {
  const theme = useMantineTheme();

  const [loggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  return (
    <Box
      sx={{
        borderTop: `1px solid ${
          theme.colorScheme === 'dark'
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
        marginTop: 'auto',
      }}
    >
      <UnstyledButton
        sx={{
          width: '300px',
          padding: theme.spacing.xs,
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        <Group position="apart" style={{width: "220px"}}>
          <Avatar radius='xl' />
          <Box>
            <Text size='sm' weight={500}>
              {loggedIn}
            </Text>
            <Text color='dimmed' size='xs'>
              {loggedIn ? 'NSW Graduate' : 'Login'}
            </Text>
          </Box>
          <Box><ChevronRight size={18} /></Box>
        </Group>
      </UnstyledButton>
    </Box>
  );
};

export default NavbarFooter;
