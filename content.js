/*
content.js
Extract lessons from Hemis page and respond to messages from popup.
*/
function extractLessons() {
  const days = document.querySelectorAll(".box.box-success.sh");
  const result = [];
  days.forEach(day => {
    const dayName = (day.querySelector("h3")?.childNodes[0]?.textContent || "").trim();
    const date = (day.querySelector("span.pull-right")?.textContent || "").trim();
    const lessons = [];
    day.querySelectorAll("li.list-group-item").forEach(li => {
      const name = (li.childNodes[0]?.textContent || "").trim();
      const spans = li.querySelectorAll("span.text-center.text-muted");
      const room = (spans[0]?.textContent || "").trim();
      const type = (spans[1]?.textContent || "").trim();
      const teacher = (spans[2]?.textContent || "").trim();
      const time = (li.querySelector(".pull-right.text-muted")?.textContent || "").trim();
      lessons.push({ name, room, type, teacher, time });
    });
    result.push({ dayName, date, lessons });
  });
  return result;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg === "getSchedule") {
    try {
      const data = extractLessons();
      sendResponse({ ok: true, data });
    } catch (e) {
      sendResponse({ ok: false, error: e.message });
    }
  }
});
