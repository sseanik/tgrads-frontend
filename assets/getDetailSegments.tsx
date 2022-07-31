import { BiWine } from 'react-icons/bi';
import { GiLargeDress, GiMeal } from 'react-icons/gi';
import { Calendar, Clock, CurrencyDollar, Map2 } from 'tabler-icons-react';

export const getDetailSegments = (
  isEventOver: boolean,
  days: number,
  hours: number
) => {
  return [
    {
      title: 'Location',
      blurb: {
        title: 'King St Wharf 3',
        link: 'https://www.google.com/maps/place/King+Street+Wharf+3/@-33.8668541,151.2000156,18z/data=!4m5!3m4!1s0x0:0xe3f07a964c511a7d!8m2!3d-33.8668167!4d151.2007484',
      },
      footnote: {
        title: 'Darling Harbour',
        size: 'sm',
        link: null,
      },
      colour: '#43b2e9',
      icon: Map2,
      iconCheck: false,
    },
    {
      title: 'Date',
      blurb: {
        title: 'Saturday, 3rd of September',
        link: null,
      },
      footnote: {
        title: `Countdown:
      ${isEventOver ? ` ${days} Days ago` : ` ${days} Days, ${hours} Hours`}`,
        size: 'sm',
        link: null,
      },
      colour: '#e5832a',
      icon: Calendar,
      iconCheck: false,
    },
    {
      title: 'Time',
      blurb: {
        title: 'Board at 6:15pm',
        link: null,
      },
      footnote: {
        title: 'Ends at 10:30pm',
        size: 'md',
        link: null,
      },
      colour: '#95c44d',
      icon: Clock,
      iconCheck: false,
    },
    {
      title: 'Price',
      blurb: {
        title: '$109 for all NSW Grads',
        link: null,
      },
      footnote: {
        title: '$99 for interstate Grads',
        size: 'md',
        link: null,
      },
      colour: '#ed3693',
      icon: CurrencyDollar,
      iconCheck: false,
    },
    {
      title: 'Dress Code:',
      blurb: {
        title: 'Cocktail',
        link: null,
      },
      footnote: {
        title: '',
        size: 'md',
        link: null,
      },
      colour: '#9e61ff',
      icon: GiLargeDress,
      iconCheck: false,
    },
    {
      title: 'Food:',
      blurb: {
        title: 'Food from the cocktail menu',
        link: null,
      },
      footnote: {
        title: 'See the food menu',
        size: 'sm',
        link: 'https://drive.google.com/file/d/1rrpp6xKHq8pmoJnSk2FCA-veXmrXYkPN/view?usp=sharing',
      },
      colour: '#ff665b',
      icon: GiMeal,
      iconCheck: true,
    },
    {
      title: 'Drinks:',
      blurb: {
        title: 'Unlimited beer, wine, soft drinks',
        link: null,
      },
      footnote: {
        title: 'See the drinks menu',
        size: 'sm',
        link: 'https://drive.google.com/file/d/1AHT8QX3HcMy8TLBWNp0XsfAUv3R13t2s/view?usp=sharing',
      },
      colour: '#5a71e8',
      icon: BiWine,
      iconCheck: true,
    },
  ];
};
