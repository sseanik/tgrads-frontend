import {
  MjmlCarousel,
  MjmlCarouselImage,
  MjmlColumn,
  MjmlImage,
  MjmlSection,
  MjmlSpacer,
  MjmlText,
} from 'mjml-react';

const StateSection = ({ blurbs }) => {
  return (
    <>
      {blurbs.map((blurb) => {
        return (
          <>
            <MjmlSection background-color='#fff' css-class='border-shadow'>
              <MjmlSection padding='0 0 20px 0'>
                <MjmlText
                  align='center'
                  color='#212b35'
                  font-weight='bold'
                  font-size='20px'
                >
                  {blurb.State}
                </MjmlText>
              </MjmlSection>
              <MjmlSection padding='0 10px'>
                {blurb.Photos.data.length > 1 ? (
                  <MjmlCarousel
                    thumbnails='hidden'
                    icon-width={30}
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
                  <MjmlColumn>
                    <MjmlImage src={blurb.Photos.data[0].attributes.url} />
                  </MjmlColumn>
                )}
              </MjmlSection>

              <MjmlSection padding='20px 20px 0 20px'>
                <MjmlText color='#3d444d' font-size='14px' line-height='1.2'>
                  {blurb.Description}
                </MjmlText>
              </MjmlSection>
            </MjmlSection>
            <MjmlSpacer />
          </>
        );
      })}
    </>
  );
};

export default StateSection;
