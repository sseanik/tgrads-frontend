import { MjmlColumn, MjmlSection, MjmlText, MjmlWrapper } from 'mjml-react';

import { Grad } from '../../types/User';
import {
  filterBirthdaysOnStarSign,
  getStarSigns,
} from '../../utils/birthdayUtil';
import CustomGap from './MjmlCustomGap';

interface MjmlBirthdayBlurbProps {
  grads: Grad[];
  month: string;
}

const MjmlBirthdayBlurb = ({ grads, month }: MjmlBirthdayBlurbProps) => {
  // Filter two sets of grad based on their birthday/star signs
  const { birthdayGradsA, birthdayGradsB } = filterBirthdaysOnStarSign(
    grads,
    month
  );
  // Get the star signs possible for a month
  const [starSignA, starSignB] = getStarSigns(month);

  return (
    <>
      <MjmlWrapper
        background-color='#fcfdff'
        css-class='border-shadow'
        padding='20px 0 0 0'
      >
        <MjmlSection padding='0px'>
          <MjmlColumn padding='0px'>
            <MjmlText
              align='center'
              color='#212b35'
              font-weight='bold'
              font-size='20px'
              padding='0px'
            >
              {`Past & Upcoming Birthdays`}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection>
          <MjmlColumn>
            <MjmlText
              padding={3}
              color='#212b35'
              font-weight='bold'
              font-size='16px'
              align='center'
            >
              {starSignA}
            </MjmlText>
            {birthdayGradsA.map((grad) => {
              return (
                <MjmlText
                  padding={3}
                  key={grad.attributes.FullName}
                  color='#212b35'
                  font-size='14px'
                  line-height='1.1'
                  align='center'
                >
                  {grad.attributes.FullName}
                </MjmlText>
              );
            })}
          </MjmlColumn>
          <MjmlColumn>
            <MjmlText
              paddingBottom='10px'
              color='#212b35'
              font-weight='bold'
              font-size='16px'
              align='center'
            >
              {starSignB}
            </MjmlText>
            {birthdayGradsB.map((grad) => {
              return (
                <MjmlText
                  padding={3}
                  key={grad.attributes.FullName}
                  color='#212b35'
                  font-size='14px'
                  line-height='1.1'
                  align='center'
                >
                  {grad.attributes.FullName}
                </MjmlText>
              );
            })}
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
      <CustomGap />
    </>
  );
};

export default MjmlBirthdayBlurb;
