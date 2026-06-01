'use client';

import { useState, useEffect } from 'react';

const dayMap = {
  'Monday': '週一', 'Tuesday': '週二', 'Wednesday': '週三',
  'Thursday': '週四', 'Friday': '週五',
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '09:00-11:00', '10:00-12:00', '13:00-15:00', '14:00-16:00',
];
const timeLabels = {
  '09:00-11:00': '09:00\n↓\n11:00',
  '10:00-12:00': '10:00\n↓\n12:00',
  '13:00-15:00': '13:00\n↓\n15:00',
  '14:00-16:00': '14:00\n↓\n16:00',
};

const SECTIONS = ['timetable', 'grades', 'announcements', 'checklist'];

export default function SchoolPage() {
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [activeSection, setActiveSection] = useState('timetable');
  const [checkedCourses, setCheckedCourses] = useState({});

  useEffect(() => {
    fetch('/api/courses').then((r) => r.json()).then(setCourses);
    fetch('/api/announcements').then((r) => r.json()).then(setAnnouncements);
  }, []);

  function toggleCheck(id) {
    setCheckedCourses((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const gradedCourses = courses.filter((c) => c.grade != null);

  function getGradeColor(grade) {
    if (grade >= 85) return '#2ecc71';
    if (grade >= 70) return '#f1c40f';
    return '#e74c3c';
  }

  const tabStyle = (section) => ({
    padding: '10px 18px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: activeSection === section ? 600 : 400,
    background: activeSection === section ? 'var(--pink)' : 'var(--card-bg)',
    color: activeSection === section ? '#fff' : 'var(--text)',
    boxShadow: activeSection === section ? '0 2px 8px var(--shadow)' : 'none',
    transition: 'all 0.2s',
  });

  return (
    <div>
      <div className="page-header">
        <h2>🏫 學校</h2>
        <p>課表・成績・公告・課程清單</p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        <button style={tabStyle('timetable')} onClick={() => setActiveSection('timetable')}>
          📅 本學期課表
        </button>
        <button style={tabStyle('grades')} onClick={() => setActiveSection('grades')}>
          📊 成績查詢
        </button>
        <button style={tabStyle('announcements')} onClick={() => setActiveSection('announcements')}>
          📢 課程公告
        </button>
        <button style={tabStyle('checklist')} onClick={() => setActiveSection('checklist')}>
          📋 課程列表
        </button>
      </div>

      {activeSection === 'timetable' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="timetable">
            <thead>
              <tr>
                <th style={{ background: 'var(--lavender)', minWidth: 80 }}>時間</th>
                {days.map((d) => (
                  <th key={d} style={{ minWidth: 120 }}>{dayMap[d]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot}>
                  <td style={{ textAlign: 'center', fontWeight: 600, fontSize: 11, whiteSpace: 'pre-line' }}>
                    {timeLabels[slot]}
                  </td>
                  {days.map((day) => {
                    const course = courses.find(
                      (c) => c.day === day && c.time === slot
                    );
                    return (
                      <td key={day}>
                        {course ? (
                          <div className="course-cell">
                            <div>{course.name}</div>
                            <div style={{ fontWeight: 400, fontSize: 11 }}>
                              {course.classroom}
                            </div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'grades' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--bg)' }}>
                <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid var(--border)' }}>課程名稱</th>
                <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid var(--border)' }}>課程代碼</th>
                <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid var(--border)' }}>學分</th>
                <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid var(--border)' }}>授課教師</th>
                <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid var(--border)' }}>成績</th>
              </tr>
            </thead>
            <tbody>
              {gradedCourses.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 10 }}>{c.name}</td>
                  <td style={{ padding: 10, color: '#888' }}>{c.code}</td>
                  <td style={{ padding: 10, textAlign: 'center' }}>{c.credits}</td>
                  <td style={{ padding: 10 }}>{c.teacher}</td>
                  <td style={{
                    padding: 10, textAlign: 'center', fontWeight: 700,
                    color: getGradeColor(c.grade),
                  }}>{c.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'announcements' && (
        <div style={{ display: 'grid', gap: 16 }}>
          {announcements.map((a) => (
            <div key={a.id} className="card" style={{ position: 'relative' }}>
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 4 }}>
                {new Date(a.createdAt).toLocaleDateString('zh-TW')}
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>{a.title}</h3>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{a.content}</p>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'checklist' && (
        <div className="grid-2">
          {courses.map((c) => (
            <div
              key={c.id}
              className="card notebook-bg"
              style={{
                padding: 20,
                cursor: 'pointer',
                opacity: checkedCourses[c.id] ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
              onClick={() => toggleCheck(c.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative', zIndex: 1 }}>
                <input
                  type="checkbox"
                  checked={!!checkedCourses[c.id]}
                  onChange={() => toggleCheck(c.id)}
                  style={{
                    width: 20, height: 20, accentColor: 'var(--pink)',
                    marginTop: 2, cursor: 'pointer',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 16, fontWeight: 700, marginBottom: 4,
                    textDecoration: checkedCourses[c.id] ? 'line-through' : 'none',
                  }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>
                    {c.code} · {c.credits} 學分
                  </div>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>
                    👨‍🏫 {c.teacher}
                  </div>
                  <div style={{ fontSize: 13, color: '#888' }}>
                    🕒 {c.schedule} · 🏫 {c.classroom}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
