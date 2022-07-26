import DOMPurify from 'isomorphic-dompurify';
import {
  MjmlCarousel,
  MjmlCarouselImage,
  MjmlColumn,
  MjmlImage,
  MjmlSection,
  MjmlText,
  MjmlWrapper,
} from 'mjml-react';

import CustomGap from './CustomGap';

const EventSection = ({ blurbs }) => {
  return (
    <>
      {blurbs.map((blurb) => {
        return (
          <>
            <MjmlWrapper
              background-color='#fff'
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
              <MjmlSection padding='0px'>
                <MjmlColumn padding='0px'>
                  {blurb.Photos.data.length > 1 ? (
                    <MjmlCarousel
                      thumbnails='hidden'
                      icon-width='30px'
                      left-icon='/left-arrow.png'
                      right-icon='/right-arrow.png'
                    >
                      {blurb.Photos.data.map((photo) => {
                        return (
                          <MjmlCarouselImage
                            key={photo.attributes.name}
                            src={photo.attributes.url}
                          />
                        );
                      })}
                    </MjmlCarousel>
                  ) : (
                    blurb.Photos.data.length > 0 && (
                      <MjmlImage src={blurb.Photos.data[0].attributes.url} />
                    )
                  )}
                </MjmlColumn>
              </MjmlSection>

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

export default EventSection;
