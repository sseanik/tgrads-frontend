import { AppShell as AppShellComponent, useMantineTheme } from '@mantine/core';
import { useState } from 'react';

import { NavMenu } from '../../lib/navItem';
import Header from './Header';
import Navbar from './Navbar';

type AppShellProps = {
  children: React.ReactNode;
  names: string[];
  navItems: NavMenu;
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
      navbar={
        <Navbar
          opened={opened}
          setOpened={setOpened}
          navItems={props.navItems}
        />
      }
      header={
        <Header
          opened={opened}
          setOpened={setOpened}
          navItems={props.navItems}
          names={props.names}
        />
      }
    >
      {props.children}
    </AppShellComponent>
  );
};

export default AppShell;
