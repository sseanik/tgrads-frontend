import { MjmlColumn, MjmlSection, MjmlSpacer, MjmlText } from 'mjml-react';

import { filterBirthdays, getStarSigns } from '../../utils/filterBirthdays';

const BirthdaySection = ({ grads, month }) => {
  const { birthdayGradsA, birthdayGradsB } = filterBirthdays(grads, month);
  const [starSignA, starSignB] = getStarSigns(month);

  return (
    <>
      <MjmlSection
        background-color='#fff'
        css-class='border-shadow'
        padding={20}
      >
        <MjmlSection paddingBottom={20}>
          <MjmlText
            align='center'
            color='#212b35'
            font-weight='bold'
            font-size='20px'
          >
            {`Past & Upcoming Birthdays`}
          </MjmlText>
        </MjmlSection>
        <MjmlColumn>
          <MjmlText
            padding={3}
            color='#212b35'
            font-weight='bold'
            font-size='16px'
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
              >
                {grad.attributes.FullName}
              </MjmlText>
            );
          })}
        </MjmlColumn>
        <MjmlColumn>
          <MjmlText
            padding={3}
            color='#212b35'
            font-weight='bold'
            font-size='16px'
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
              >
                {grad.attributes.FullName}
              </MjmlText>
            );
          })}
        </MjmlColumn>
      </MjmlSection>
      <MjmlSpacer />
    </>
  );
};

export default BirthdaySection;
