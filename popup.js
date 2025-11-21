document.getElementById('refresh').addEventListener('click', load);

async function load(){
  const schedule = document.getElementById('schedule');
  schedule.innerHTML = '<div class="loading">Yuklanmoqda…</div>';

  const tabs = await chrome.tabs.query({active:true,currentWindow:true});
  chrome.tabs.sendMessage(tabs[0].id, "getSchedule", res => {
    if(!res || !res.ok){
      schedule.innerHTML = '<div class="loading">Jadval topilmadi yoki sahifa ochilmadi.</div>';
      return;
    }
    render(res.data);
  });
}

function render(data){
  const container = document.getElementById('schedule');
  container.innerHTML = '';
  if(!data || data.length===0){
    container.innerHTML = '<div class="loading">Jadval bo‘sh.</div>';
    return;
  }
  data.forEach((day, idx) => {
    const dayEl = document.createElement('div');
    dayEl.className = 'day';
    dayEl.innerHTML = `
      <div class="day-head">
        <div class="day-title">${escapeHTML(day.dayName||'Kun')}</div>
        <div class="day-date">${escapeHTML(day.date||'')}</div>
      </div>
    `;
    day.lessons.forEach((l,i) => {
      const useGradient = (i % 3) === 0; // every 3rd card uses gradient
      const card = document.createElement('div');
      card.className = 'card' + (useGradient ? ' gradient' : '');
      card.innerHTML = `
        <div class="left">
          <div class="subject">${escapeHTML(l.name)}</div>
          <div class="meta"><span class="room-pill">${escapeHTML(l.room)}</span>${escapeHTML(l.type)} • ${escapeHTML(l.teacher)}</div>
        </div>
        <div class="time-badge">${escapeHTML(l.time)}</div>
      `;
      dayEl.appendChild(card);
    });
    container.appendChild(dayEl);
  });
}

function escapeHTML(s){ if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Load immediately on popup open
load();
