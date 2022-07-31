import {
  MjmlColumn,
  MjmlImage,
  MjmlSection,
  MjmlText,
  MjmlWrapper,
} from 'mjml-react';
import React from 'react';

import { MJML_STATE_COLOURS } from '../../assets/stateColours';
import { StateBlurb } from '../../types/Newsletter';
import CustomGap from './MjmlCustomGap';

const MjmlStateBlurb = ({ blurbs }: {blurbs: StateBlurb[]}) => {
  return (
    <>
      {blurbs.map((blurb) => {
        return (
          <React.Fragment key={blurb.State}>
            <MjmlWrapper
              background-color='#fcfdff'
              css-class='border-shadow'
              border-top={`8px solid ${MJML_STATE_COLOURS[blurb.State]}`}
              border-radius='6px'
            >
              <MjmlSection padding='0px'>
                <MjmlColumn padding='0px' width='90%'>
                  <MjmlText
                    align='center'
                    color='#212b35'
                    font-weight='bold'
                    font-size='20px'
                    padding='0px 0px 16px 0px'
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
                            font-size='12px'
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

export default MjmlStateBlurb;
