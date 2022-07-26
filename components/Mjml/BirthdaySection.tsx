import { MjmlColumn, MjmlSection, MjmlText, MjmlWrapper } from 'mjml-react';

import { filterBirthdays, getStarSigns } from '../../utils/filterBirthdays';
import CustomGap from './CustomGap';

const BirthdaySection = ({ grads, month }) => {
  const { birthdayGradsA, birthdayGradsB } = filterBirthdays(grads, month);
  const [starSignA, starSignB] = getStarSigns(month);

  return (
    <>
      <MjmlWrapper background-color='#fff' css-class='border-shadow' padding='20px 0 0 0'>
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

export default BirthdaySection;
