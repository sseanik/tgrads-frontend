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

const StateSection = ({ blurbs }) => {
  const colours = {
    NSW: '#8aaafe',
    QLD: '#e77f7a',
    VIC: '#b7a0f3',
    WA: '#f49440',
    SA: '#f7de81',
    ACT: '#80c97a',
  };

  return (
    <>
      {blurbs.map((blurb) => {
        return (
          <>
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
                  ) : blurb.Photos.data.length > 0 && (
                    <MjmlImage
                      src={blurb.Photos.data[0].attributes.url}
                      padding='0px'
                    />
                  )}
                </MjmlColumn>
              </MjmlSection>
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
          </>
        );
      })}
    </>
  );
};

export default StateSection;
