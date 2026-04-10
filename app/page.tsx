"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// ⚠️ 여기에 에어비앤비에서 복사한 긴 주소를 따옴표 사이에 꼭 넣어주세요!
const AIRBNB_ICAL_URL = "https://www.airbnb.co.kr/calendar/ical/1449092803394676993.ics?t=ae54c99940fb41e998f0b0b30f34e0ea";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkoutDates, setCheckoutDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCalendar() {
      try {
        // 보안 우회 통로를 통해 에어비앤비 데이터를 읽어옵니다
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(AIRBNB_ICAL_URL)}`);
        const data = await response.json();
        const icsText = data.contents;

        const dates: string[] = [];
        const lines = icsText.split('\n');
        
        lines.forEach((line: string) => {
          if (line.startsWith('DTEND')) {
            const datePart = line.split(':')[1]?.trim(); 
            if (datePart) {
              // 20260412 형식에서 날짜만 추출
              const y = datePart.slice(0, 4);
              const m = datePart.slice(4, 6);
              const d = datePart.slice(6, 8);
              dates.push(`${y}-${parseInt(m)}-${parseInt(d)}`);
            }
          }
        });
        setCheckoutDates(dates);
      } catch (e) {
        console.error("데이터 가져오기 실패:", e);
      }
    }
    fetchCalendar();
  }, []);

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const isCheckoutDay = (day: number) => {
    const target = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-${day}`;
    return checkoutDates.includes(target);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-10">
      <div className="bg-orange-600 text-white p-8 rounded-b-[40px] shadow-lg text-center">
        <div className="flex justify-between items-center mb-2">
          <button onClick={prevMonth}><ChevronLeft size={30} /></button>
          <h2 className="text-3xl font-bold">{currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월</h2>
          <button onClick={nextMonth}><ChevronRight size={30} /></button>
        </div>
        <p className="text-orange-200 tracking-widest text-xs font-bold uppercase">Firstay 1000 Mobile</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 mb-4 text-center text-xs font-bold text-gray-400">
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div key={d} className={i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : ''}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {Array(firstDayOfMonth(currentMonth)).fill(null).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth(currentMonth) }, (_, i) => i + 1).map(day => {
            const checkout = isCheckoutDay(day);
            return (
              <div 
                key={day} 
                onClick={() => checkout && setSelectedDate(`${currentMonth.getMonth()+1}월 ${day}일`)}
                className={`relative h-14 flex items-center justify-center rounded-2xl shadow-sm text-lg font-bold transition-all ${checkout ? 'bg-orange-500 text-white scale-105 z-10' : 'bg-white text-gray-700'}`}
              >
                <div className="flex flex-col items-center">
                  <span>{day}</span>
                  {checkout && <span className="text-[7px] font-black leading-none mt-1">CHECKOUT</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-50">
          <div className="bg-white w-full rounded-t-[30px] p-8 pb-12 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{selectedDate} 메모</h3>
              <button onClick={() => setSelectedDate(null)} className="text-gray-400"><X size={28}/></button>
            </div>

            <textarea className="w-full h-40 p-4 border-2 border-orange-100 rounded-2xl outline-none focus:border-orange-500 text-lg" placeholder="혜빈님께 공유드립니다" />
            <button className="w-full bg-orange-600 text-white font-bold py-4 rounded-2xl mt-4 text-xl shadow-lg">저장하기</button>
          </div>
        </div>
      )}
    </div>
  );
}