import { NextResponse } from 'next/server';

export async function GET() {
  const ICAL_URL = "https://www.airbnb.co.kr/calendar/ical/1449092803394676993.ics?t=ae54c99940fb41e998f0b0b30f34e0ea";
  
  try {
    const response = await fetch(ICAL_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 0 }
    });

    const text = await response.text();
    const reservations: { y: number; m: number; d: number }[] = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (line.includes('DTEND')) {
        const match = line.match(/(\d{4})(\d{2})(\d{2})/);
        if (match) {
          // 릴리님! 이번엔 더하거나 빼지 않고 에어비앤비 숫자를 있는 그대로 가져옵니다.
          const year = parseInt(match[1]);
          const month = parseInt(match[2]);
          const day = parseInt(match[3]);
          
          reservations.push({
            y: year,
            m: month,
            d: day
          });
        }
      }
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    return NextResponse.json({ reservations: [] });
  }
}