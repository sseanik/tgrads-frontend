import DOMPurify from 'isomorphic-dompurify';
import {
  MjmlColumn,
  MjmlImage,
  MjmlSection,
  MjmlText,
  MjmlWrapper,
} from 'mjml-react';

import { EventBlurb } from '../../types/Newsletter';
import CustomGap from './MjmlCustomGap';

const MjmlEventBlurb = ({ blurbs }: { blurbs: EventBlurb[] }) => {
  return (
    <>
      {blurbs.map((blurb) => {
        return (
          <>
            <MjmlWrapper
              key={blurb.Title}
              background-color='#fcfdff'
              css-class='border-shadow'
              padding='8px 0px'
            >
              <MjmlSection padding='0px'>
                <MjmlColumn padding='0px'>
                  <MjmlText
                    align='center'
                    color='#212b35'
                    font-weight='bold'
                    font-size='20px'
                    padding-bottom='18px'
                  >
                    {blurb.Title}
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
                    align='center'
                    color='#212b35'
                    font-size='14px'
                    line-height='1.2'
                    padding='0px 30px 0px 30px'
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(blurb.Description),
                      }}
                    />
                  </MjmlText>
                </MjmlColumn>
              </MjmlSection>
            </MjmlWrapper>
            <CustomGap />
          </>
        );
      })}
    </>
  );
};

export default MjmlEventBlurb;
