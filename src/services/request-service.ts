
export const getEvents = async () => {
  try {
    const body = await fetch(`${process.env.REACT_APP_SERVER_URL}/events`);
    const events = await body.json();
    return events;
  } catch (e) {
    console.log(e);
  }
}