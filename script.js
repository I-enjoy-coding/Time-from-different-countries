// Get the list of time zones supported by this browser/environment
const allTimeZones = typeof Intl.supportedValuesOf === 'function'
  ? Intl.supportedValuesOf('timeZone')
  : [];  // fallback: could hardcode or import a list

// Filter function for search
function filterZones(query) {
  const q = query.toLowerCase();
  return allTimeZones.filter(zone => zone.toLowerCase().includes(q));
}

// Create a clock card element
function createClockCard(zone) {
  const card = document.createElement('div');
  card.className = 'clock-card';
  card.dataset.zone = zone;

  const zoneLabel = document.createElement('div');
  zoneLabel.className = 'clock-zone';
  zoneLabel.textContent = zone;

  const timeEl = document.createElement('div');
  timeEl.className = 'clock-time';
  timeEl.id = `time_${zone.replaceAll('/', '_')}`;
  timeEl.textContent = '–:–:–';

  card.appendChild(zoneLabel);
  card.appendChild(timeEl);
  return card;
}

// Update times shown for visible clocks
function updateTimes() {
  const now = new Date();
  document.querySelectorAll('.clock-card').forEach(card => {
    const zone = card.dataset.zone;
    const timeEl = card.querySelector('.clock-time');
    try {
      const timeStr = now.toLocaleTimeString('en-GB', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      timeEl.textContent = timeStr;
    } catch (err) {
      // some zones might throw error if unsupported
      timeEl.textContent = '––:––';
    }
  });
}

// Render clocks based on filtered zones
function renderClocks(zones) {
  const container = document.getElementById('clocks-container');
  container.innerHTML = '';
  zones.forEach(zone => {
    const card = createClockCard(zone);
    container.appendChild(card);
  });
  updateTimes();
}

// On DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');

  // Initially show all zones
  renderClocks(allTimeZones);

  // Update every second
  setInterval(updateTimes, 1000);

  // Filter as user types
  searchInput.addEventListener('input', () => {
    const filtered = filterZones(searchInput.value);
    renderClocks(filtered);
  });
});
