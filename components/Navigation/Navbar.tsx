import { Navbar as NavbarComponent } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

import { NavMenu } from '../../lib/navItem';
import MobileMenuButton from './MobileMenuButton';
import NavbarFooter from './NavbarFooter';
// import NavbarFooter from './NavbarFooter';

interface NavbarProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  navItems: NavMenu;
}

const Navbar = ({ opened, setOpened, navItems }: NavbarProps) => {
  const router = useRouter();
  const state = router.query.state as string;

  const [loggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  const sortedNavItems = loggedIn
    ? navItems.common.filter(
        (navItem) => navItem.text !== JSON.parse(loggedIn).State
      )
    : navItems.common;
  if (loggedIn) {
    const stateMatchedNavItem = navItems.common.find(
      (navItem) => navItem.text === JSON.parse(loggedIn).State
    );
    if (stateMatchedNavItem) sortedNavItems.unshift(stateMatchedNavItem);
  }

  return (
    <NavbarComponent
      fixed
      sx={{
        transition: 'width 500ms ease, min-width 500ms ease',
        overflow: 'hidden',
        width: opened ? 255 : 0,
        '@media (min-width: 735px)': {
          width: 0,
        },
        justifyContent: 'space-between',
      }}
    >
      <NavbarComponent.Section mt={10}>
        {state
          ? sortedNavItems.map((item) => {
              return (
                <MobileMenuButton
                  key={item.url}
                  {...item}
                  url={`${state}/${item.url}`}
                  setOpened={setOpened}
                />
              );
            })
          : sortedNavItems.map((item) => {
              return (
                <MobileMenuButton
                  key={item.url}
                  {...item}
                  setOpened={setOpened}
                />
              );
            })}
      </NavbarComponent.Section>
      <NavbarComponent.Section>
        <NavbarFooter />
      </NavbarComponent.Section>
    </NavbarComponent>
  );
};

export default Navbar;
