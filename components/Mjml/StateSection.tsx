import {
  MjmlColumn,
  MjmlImage,
  MjmlSection,
  MjmlText,
  MjmlWrapper,
} from 'mjml-react';
import React from 'react';

import CustomGap from './CustomGap';

const StateSection = ({ blurbs }) => {
  const colours = {
    NSW: '#8aaafe',
    QLD: '#e77f7a',
    VIC: '#b7a0f3',
    WA: '#f49440',
    SA: '#f7de81',
    ACT: '#80c97a',
  };

  console.log(blurbs[0].Photos.data);

  return (
    <>
      {blurbs.map((blurb) => {
        return (
          <React.Fragment key={blurb.State}>
            <MjmlWrapper
              background-color='#fff'
              css-class='border-shadow'
              border-top={`12px solid ${colours[blurb.State]}`}
            >
              <MjmlSection padding='0px'>
                <MjmlColumn padding='0px'>
                  <MjmlText
                    align='center'
                    color='#212b35'
                    font-weight='bold'
                    font-size='20px'
                    padding='0px 0px 18px 0px'
                  >
                    {blurb.State}
                  </MjmlText>
                </MjmlColumn>
              </MjmlSection>
              {blurb.Photos.data.map((photo) => {
                return (
                  <MjmlSection
                    padding='0 10px 10px 10px'
                    key={photo.attributes.name}
                  >
                    <MjmlColumn padding='0px'>
                      <MjmlImage src={photo.attributes.url} padding='0px' />;
                      {photo.attributes.caption !== '' &&
                        photo.attributes.caption !== photo.attributes.name && (
                          <MjmlText
                            color='#3d444d'
                            font-size='14px'
                            line-height='1.2'
                            align='center'
                          >
                            {photo.attributes.caption}
                          </MjmlText>
                        )}
                    </MjmlColumn>
                  </MjmlSection>
                );
              })}
              <MjmlSection padding='0px'>
                <MjmlColumn padding='0px'>
                  <MjmlText
                    color='#3d444d'
                    font-size='14px'
                    line-height='1.2'
                    padding='15px 30px 0 30px'
                  >
                    {blurb.Description}
                  </MjmlText>
                </MjmlColumn>
              </MjmlSection>
            </MjmlWrapper>
            <CustomGap />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default StateSection;
