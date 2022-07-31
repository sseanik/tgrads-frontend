import {
  GiGoat,
  GiHorseHead,
  GiLightningStorm,
  GiPirateFlag,
  GiSydneyOperaHouse,
  GiVikingHead,
} from 'react-icons/gi';

export const stateItems = {
  NSW: {
    name: 'New South Wales',
    icon: <GiSydneyOperaHouse size={22} />,
    colour: 'blue',
  },
  QLD: { name: 'Queensland', icon: <GiHorseHead size={22} />, colour: 'red' },
  SA: {
    name: 'South Australia',
    icon: <GiGoat size={22} />,
    colour: 'yellow',
  },
  VIC: {
    name: 'Victoria',
    icon: <GiLightningStorm size={22} />,
    colour: 'indigo',
  },
  WA: {
    name: 'Western Australia',
    icon: <GiPirateFlag size={22} />,
    colour: 'orange',
  },
  ACT: {
    name: 'Australian Capital Territory',
    icon: <GiVikingHead size={22} />,
    colour: 'green',
  },
};
