import {
  Burger,
  Header as HeaderComponent,
  MediaQuery,
  useMantineTheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

import { NavItems, NavMenu } from '../../assets/navItem';
import { Grad } from '../../types/User';
import { getSortedNavItems } from '../../utils/sortNavItems';
import Logo from './Logo';
import MenuButton from './MenuButton';
import ProfileMenu from './ProfileMenu';

interface HeaderProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  navItems: NavMenu;
  grads: Grad[];
}

const RESPONSIVE_WIDTH = 725;

const Header = ({ opened, setOpened, navItems, grads }: HeaderProps) => {
  // Theme to use for breakpoints and what color mode is currently selected
  const theme = useMantineTheme();
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
    <HeaderComponent height={70} p='md' style={{ padding: '0 20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <MediaQuery
          largerThan={!state ? RESPONSIVE_WIDTH : theme.breakpoints.xs}
          styles={{ display: 'none' }}
        >
          <Burger
            opened={opened}
            onClick={() => setOpened((open: boolean) => !open)}
            size='sm'
            color={theme.colorScheme === 'dark' ? '#efefff' : '#3c4394'}
            mr='xl'
          />
        </MediaQuery>

        <Logo />

        <div style={{ flex: 1, display: 'flex', height: '100%' }}>
          <MediaQuery
            smallerThan={!state ? RESPONSIVE_WIDTH : theme.breakpoints.xs}
            styles={{ display: 'none' }}
          >
            <div>
              {state ? (
                <span>
                  {/* Events, Gallery, etc */}
                  {sortedNavItems.map((item) => {
                    return (
                      <MenuButton
                        key={`${state}/${item.url}`}
                        {...item}
                        url={`${state}/${item.url}`}
                        state={state}
                      />
                    );
                  })}
                  {/* Cruise */}
                  {navItems[state] &&
                    navItems[state].map((item: NavItems) => {
                      return (
                        <MenuButton key={item.url} {...item} state={state} />
                      );
                    })}
                </span>
              ) : (
                sortedNavItems.map((item) => {
                  // States, e.g. NSW, VIC, etc
                  return <MenuButton key={item.url} {...item} state={state} />;
                })
              )}
            </div>
          </MediaQuery>
        </div>

        <ProfileMenu grads={grads} />
      </div>
    </HeaderComponent>
  );
};

export default Header;
