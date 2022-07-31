import { Accordion, Box, Card, Text } from '@mantine/core';
import Image from 'next/image';

interface HeaderBlurbProps {
  title: string;
  gif: string;
  description: string;
}

const HeaderBlurb = ({ title, gif, description }: HeaderBlurbProps) => {
  const responsiveWidth = '@media (max-width: 600px)';

  return (
    <Card shadow='sm' p={0} mt={10} mb={8}>
      <Accordion
        defaultValue='newsletter-heading-0'
        styles={{
          label: { fontWeight: 700 },
        }}
      >
        <Accordion.Item value='newsletter-heading-0' m={0}>
          <Accordion.Control>{title}</Accordion.Control>
          <Accordion.Panel>
            <Box
              sx={() => ({
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                [responsiveWidth]: {
                  flexDirection: 'column',
                },
              })}
            >
              <Image
                src={gif}
                alt={`${title}-gif`}
                width={200}
                height={200}
                objectFit='contain'
              />
              <Text
                sx={() => ({
                  width: 'calc(100% - 200px)',
                  paddingLeft: '20px',
                  [responsiveWidth]: {
                    paddingLeft: 0,
                    width: '100%',
                  },
                })}
              >
                {description}
              </Text>
            </Box>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};

export default HeaderBlurb;
