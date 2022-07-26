import { MjmlColumn, MjmlSection, MjmlSpacer } from 'mjml-react';

const CustomGap = () => {
  return (
    <MjmlSection padding='0px'>
      <MjmlColumn>
        <MjmlSpacer />
      </MjmlColumn>
    </MjmlSection>
  );
};

export default CustomGap;
