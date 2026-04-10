export default async function handler(req, res) {
  const AIRBNB_URL = "https://www.airbnb.co.kr/calendar/ical/1449092803394676993.ics?t=ae54c99940fb41e998f0b0b30f34e0ea";
  try {
    const response = await fetch(AIRBNB_URL);
    const data = await response.text();
    res.setHeader('Content-Type', 'text/calendar');
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send("Error");
  }
}
