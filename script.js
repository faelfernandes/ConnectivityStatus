document.addEventListener("DOMContentLoaded", () => {
  // IPs defined directly in the script
  const ips = [
      "192.168.1.1",
      "192.168.1.2",
      "192.168.1.3"
  ];

  const statusContainer = document.getElementById('statusContainer');
  const currentTimeElement = document.getElementById('currentTime');
  const nextReconnectElement = document.getElementById('nextReconnect');
  const reconnectAllButton = document.getElementById('reconnectAll');
  const intervalTime = 60000; // 1 minute in milliseconds
  let nextReconnectTime = intervalTime / 1000; // Initialize next reconnect time in seconds

  function updateCurrentTime() {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      currentTimeElement.textContent = `Hora atual: ${now.toLocaleDateString('pt-BR', options)}`;
  }

  function updateNextReconnectTime() {
      nextReconnectElement.textContent = `Próxima tentativa em: ${nextReconnectTime} segundos`;
  }

  function decrementNextReconnectTime() {
      if (nextReconnectTime > 0) {
          nextReconnectTime--;
          updateNextReconnectTime();
      }
  }

  function incrementAttempts(ip) {
      const attemptsElement = document.getElementById(`attempts-${ip}`);
      let attempts = parseInt(attemptsElement.textContent);
      attemptsElement.textContent = ++attempts;
  }

  function checkConnectivity(ip, element) {
      fetch(`http://${ip}`, { mode: 'no-cors' })
          .then(() => {
              element.className = 'status green';
              element.querySelector('.status-icon').innerHTML = '<i class="fas fa-check-circle"></i>';
          })
          .catch(() => {
              element.className = 'status red';
              element.querySelector('.status-icon').innerHTML = '<i class="fas fa-times-circle"></i>';
          });
  }

  function reconnectAll() {
      ips.forEach(ip => {
          const statusElement = document.getElementById(`status-${ip}`);
          statusElement.className = 'status loading';
          statusElement.querySelector('.status-icon').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
          incrementAttempts(ip);
          checkConnectivity(ip, statusElement);
      });
      nextReconnectTime = intervalTime / 1000; // Reset the next reconnect time
      updateNextReconnectTime();
  }

  ips.forEach(ip => {
      const statusElement = document.createElement('div');
      statusElement.id = `status-${ip}`;
      statusElement.className = 'status loading';
      statusElement.innerHTML = `
          <p>${ip}</p>
          <p class="attempts">Attempts: <span id="attempts-${ip}">0</span></p>
          <p class="status-icon"><i class="fas fa-spinner fa-spin"></i></p>
      `;
      statusContainer.appendChild(statusElement);

      statusElement.addEventListener('click', () => {
          statusElement.className = 'status loading';
          statusElement.querySelector('.status-icon').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
          incrementAttempts(ip);
          checkConnectivity(ip, statusElement);
      });

      checkConnectivity(ip, statusElement);
  });

  reconnectAllButton.addEventListener('click', reconnectAll);

  setInterval(() => {
      reconnectAll();
  }, intervalTime);

  setInterval(updateCurrentTime, 1000); // Update current time every second
  setInterval(decrementNextReconnectTime, 1000); // Update next reconnect time every second

  updateCurrentTime();
  updateNextReconnectTime();
});
