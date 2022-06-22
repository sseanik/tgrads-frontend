import {
  Avatar,
  Box,
  Group,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import {
  ChevronRight,
} from 'tabler-icons-react';

const NavbarFooter = () => {
  const theme = useMantineTheme();

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
        <Group>
          <Avatar
            src='https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80'
            radius='xl'
          />
          <Box>
            <Text size='sm' weight={500}>
              Sean Smith
            </Text>
            <Text color='dimmed' size='xs'>
              Software Engineer
            </Text>
          </Box>
          <ChevronRight size={18} />
        </Group>
      </UnstyledButton>
    </Box>
  );
};

export default NavbarFooter;
