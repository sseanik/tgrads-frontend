import { Avatar, Box, Text, useMantineTheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

const NavbarFooter = () => {
  // Theme to determine color mode and padding attributes
  const theme = useMantineTheme();

  // Local Storage logged in to determine to show navbar footer
  const [loggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  // Return empty if user is not logged in
  if (loggedIn === '' || !loggedIn) {
    return <></>;
  }

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
      <Box
        sx={{
          width: '250px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginLeft: 10,
          gap: 20,
          padding: theme.spacing.xs,
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        }}
      >
        <Avatar radius='xl' color='indigo'>
          {JSON.parse(loggedIn).FullName.replace(/[^A-Z]/g, '')}
        </Avatar>
        <Box>
          <Text size='sm' weight={500}>
            {JSON.parse(loggedIn).FullName}
          </Text>
          <Text color='dimmed' size='xs'>
            {`${JSON.parse(loggedIn).State} Graduate`}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default NavbarFooter;
