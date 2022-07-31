import { MjmlColumn, MjmlSection, MjmlSpacer } from 'mjml-react';

const MjmlCustomGap = () => {
  return (
    <MjmlSection padding='0px'>
      <MjmlColumn>
        <MjmlSpacer />
      </MjmlColumn>
    </MjmlSection>
  );
};

export default MjmlCustomGap;
