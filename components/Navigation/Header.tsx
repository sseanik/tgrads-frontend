import {
  Burger,
  Header as HeaderComponent,
  MediaQuery,
  useMantineTheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

import { NavMenu } from '../../lib/navItem';
import { Grad } from '../../types/User';
import Logo from './Logo';
import MenuButton from './MenuButton';
import ProfileMenu from './ProfileMenu';

interface HeaderProps {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  navItems: NavMenu;
  grads: Grad[];
}

const Header = ({ opened, setOpened, navItems, grads }: HeaderProps) => {
  const theme = useMantineTheme();
  const router = useRouter();
  const state = router.query.state as string;

  const [loggedIn] = useLocalStorage({
    key: 'loggedIn',
    defaultValue: '',
    getInitialValueInEffect: true,
  });

  const sortedNavItems = loggedIn ? navItems.common.filter(
    (navItem) => navItem.text !== JSON.parse(loggedIn).State
  ) : navItems.common;
  if (loggedIn) {
    const stateMatchedNavItem = navItems.common.find(
      (navItem) => navItem.text === JSON.parse(loggedIn).State
    );
    if (stateMatchedNavItem) sortedNavItems.unshift(stateMatchedNavItem);
  }

  return (
    <HeaderComponent height={70} p='md' style={{ padding: '0 10px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <MediaQuery largerThan={734} styles={{ display: 'none' }}>
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
          <MediaQuery smallerThan={735} styles={{ display: 'none' }}>
            <div>
              {state ? (
                <span>
                  {sortedNavItems.map((item) => {
                    return (
                      <MenuButton
                        key={`${state}/${item.url}`}
                        {...item}
                        url={`${state}/${item.url}`}
                      />
                    );
                  })}
                  {/* Cruise */}
                  {navItems[state] &&
                    navItems[state].map((item) => {
                      return <MenuButton key={item.url} {...item} />;
                    })}
                </span>
              ) : (
                sortedNavItems.map((item) => {
                  return <MenuButton key={item.url} {...item} />;
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
