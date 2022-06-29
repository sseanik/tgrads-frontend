import { AppShell as AppShellComponent, useMantineTheme } from '@mantine/core';
import { useState } from 'react';

import Header from '../components/Header';
import Navbar from '../components/Navbar';

type AppShellProps = {
  children: React.ReactNode;
};

const AppShell = (props: AppShellProps) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <AppShellComponent
      zIndex={101}
      fixed
      styles={{
        main: {
          transition: 'padding-left 500ms ease',
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbar={<Navbar opened={opened} />}
      header={<Header opened={opened} setOpened={setOpened} />}
    >
      {props.children}
    </AppShellComponent>
  );
};

export default AppShell;
