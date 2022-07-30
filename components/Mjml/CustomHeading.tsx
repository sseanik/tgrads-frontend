import DOMPurify from 'isomorphic-dompurify';
import {
  MjmlColumn,
  MjmlImage,
  MjmlSection,
  MjmlSpacer,
  MjmlText,
} from 'mjml-react';

const CustomHeading = ({ title, description, gif }) => {
  return (
    <MjmlSection background-color='#fcfdff' css-class='border-shadow' padding='10px'>
      <MjmlColumn padding='0'>
        <MjmlImage src={gif} padding='0'/>
      </MjmlColumn>
      <MjmlColumn padding='0'> 
        <MjmlText color='#212b35' font-weight='bold' font-size='20px'>
          {title}
        </MjmlText>
        <MjmlText color='#3d444d' font-size='15px' line-height='1.25'>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description),
            }}
          />
        </MjmlText>
        <MjmlSpacer />
      </MjmlColumn>
    </MjmlSection>
  );
};

export default CustomHeading;
