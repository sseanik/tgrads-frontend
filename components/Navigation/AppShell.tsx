import { AppShell as AppShellComponent, useMantineTheme } from '@mantine/core';
import { useState } from 'react';

import { NavMenu } from '../../lib/navItem';
import { Grad } from '../../types/User';
import Footer from './Footer';
import Header from './Header';
import Navbar from './Navbar';

type AppShellProps = {
  children: React.ReactNode;
  grads: Grad[];
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
          grads={props.grads}
        />
      }
      footer={<Footer />}
    >
      {props.children}
    </AppShellComponent>
  );
};

export default AppShell;
