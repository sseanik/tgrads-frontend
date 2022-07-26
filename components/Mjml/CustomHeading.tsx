import { MjmlColumn, MjmlImage, MjmlSection, MjmlSpacer, MjmlText } from 'mjml-react';

const CustomHeading = ({ title, description, gif }) => {
  return (
    <MjmlSection background-color='#fff' css-class='border-shadow'>
      <MjmlColumn>
        <MjmlImage src={gif} />
      </MjmlColumn>
      <MjmlColumn>
        <MjmlText color='#212b35' font-weight='bold' font-size='20px'>
          {title}
        </MjmlText>
        <MjmlText color='#3d444d' font-size='15px' line-height='1.25'>
          {description}
        </MjmlText>
        <MjmlSpacer />
      </MjmlColumn>
    </MjmlSection>
  );
};

export default CustomHeading;
