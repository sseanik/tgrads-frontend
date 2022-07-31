import { Navbar as NavbarComponent } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

import { NavItems, NavMenu } from '../../assets/navItem';
import { getSortedNavItems } from '../../utils/sortNavItems';
import MobileMenuButton from './MobileMenuButton';
import NavbarFooter from './NavbarFooter';

interface NavbarProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  navItems: NavMenu;
}

const RESPONSIVE_WIDTH = '@media (min-width: 735px)';

const Navbar = ({ opened, setOpened, navItems }: NavbarProps) => {
  // Router to get state from current URL
  const router = useRouter();
  const state = router.query.state as string;

  // Local Storage item to use for reordering of navbar items
  const [loggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });
  // If user is logged in, put their state at the front of the nav items
  const sortedNavItems = getSortedNavItems(loggedIn, navItems);

  return (
    <NavbarComponent
      fixed
      sx={{
        transition: 'width 500ms ease, min-width 500ms ease',
        overflow: 'hidden',
        width: opened ? 255 : 0,
        [RESPONSIVE_WIDTH]: {
          width: 0,
        },
        justifyContent: 'space-between',
      }}
    >
      <NavbarComponent.Section mt={10}>
        {state ? (
          <>
            {/* Events, Gallery, etc */}
            {sortedNavItems.map((item) => {
              return (
                <MobileMenuButton
                  key={item.url}
                  {...item}
                  url={`${state}/${item.url}`}
                  setOpened={setOpened}
                  state={state}
                />
              );
            })}
            {/* Cruise */}
            {navItems[state] &&
              navItems[state].map((item: NavItems) => {
                return (
                  <MobileMenuButton
                    key={item.url}
                    {...item}
                    setOpened={setOpened}
                    state={state}
                  />
                );
              })}
          </>
        ) : (
          sortedNavItems.map((item) => {
            // States, e.g. NSW, VIC, etc
            return (
              <MobileMenuButton
                key={item.url}
                {...item}
                setOpened={setOpened}
                state={state}
              />
            );
          })
        )}
      </NavbarComponent.Section>
      <NavbarComponent.Section>
        <NavbarFooter />
      </NavbarComponent.Section>
    </NavbarComponent>
  );
};

export default Navbar;
