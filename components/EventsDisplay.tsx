import {
  Badge,
  Button,
  Card,
  Group,
  Indicator,
  ScrollArea,
  Image,
  Text,
  useMantineTheme,
  Title,
} from '@mantine/core';

interface EventsDisplayProps {
  events: any;
  upcomingDate: any;
  title: string;
}

const EventsDisplay = (props: EventsDisplayProps) => {
  const theme = useMantineTheme();

  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

  const convertDateToReadable = (dateStr: string) => {
    return new Date(dateStr).toDateString().slice(0, -5);
  };

  const isDateSoon = (dateStr: string) => {
    return new Date(dateStr).getMonth() - new Date().getMonth() <= 1;
  };

  return (
    <>
      <Text ml={8} weight={600} size='xl'>
        {props.title}
      </Text>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
        }}
      >
        {props.events.map((event: any) => {
          return (
            <div key={event.attributes.Slug} style={{ width: 340 }}>
              <Indicator
                inline
                size={
                  props.upcomingDate(event.attributes.Date) &&
                  isDateSoon(event.attributes.Date)
                    ? 20
                    : 0
                }
                offset={10}
                label={
                  props.upcomingDate(event.attributes.Date) &&
                  isDateSoon(event.attributes.Date)
                    ? 'Soon'
                    : ''
                }
                color='lime'
              >
                <Card
                  shadow='sm'
                  p='lg'
                  m={10}
                  style={{
                    height: '100%',
                  }}
                >
                  <Card.Section>
                    <Image
                      src={event.attributes.Image.data.attributes.url}
                      height={160}
                      alt=''
                    />
                  </Card.Section>

                  <Group
                    position='apart'
                    style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
                  >
                    <Text weight={700}>{event.attributes.Title}</Text>
                  </Group>
                  <Badge
                    color={
                      props.upcomingDate(event.attributes.Date)
                        ? 'green'
                        : 'gray'
                    }
                    variant='dot'
                    size='md'
                    fullWidth
                    mb={5}
                  >
                    {convertDateToReadable(event.attributes.Date)}
                  </Badge>

                  <ScrollArea
                    style={{ height: 110 }}
                    offsetScrollbars
                    scrollbarSize={8}
                  >
                    <Text
                      size='sm'
                      style={{ color: secondaryColor, lineHeight: 1.5 }}
                    >
                      {event.attributes.Description}
                    </Text>
                  </ScrollArea>

                  <Button
                    variant='light'
                    color='blue'
                    fullWidth
                    style={{ marginTop: 14 }}
                  >
                    Go to Event
                  </Button>
                </Card>
              </Indicator>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EventsDisplay;
