'use strict';

/**
 * toggle active class on header
 * when clicked nav-toggle-btn
 */

const header = document.querySelector("[data-header]");
const navToggleBtn = document.querySelector("[data-menu-toggle-btn]");

navToggleBtn.addEventListener("click", function () {
  header.classList.toggle("active");
});


/**
 * toggle ctx-menu when click on card-menu-btn
 */

const menuBtn = document.querySelectorAll("[data-menu-btn]");

for (let i = 0; i < menuBtn.length; i++) {
  menuBtn[i].addEventListener("click", function () {
    this.nextElementSibling.classList.toggle("active");
  });
}


/**
 * load more btn loading spin toggle
 */

// Rastgele veriler
const generateRandomData = (count) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      createdAt: new Date(Date.now() - (i * 1000 * 60 * 5)), // Son 5 dakika içinde
      soilTemperature: (Math.random() * 10 + 15).toFixed(2), // 15 ile 25 arasında
      soilMoisture: (Math.random() * 100).toFixed(2), // 0 ile 100 arasında
      soilPH: (Math.random() * 2 + 6).toFixed(2), // 6 ile 8 arasında
      airTemperature: (Math.random() * 5 + 20).toFixed(2), // 20 ile 25 arasında
      airHumidity: (Math.random() * 100).toFixed(2), // 0 ile 100 arasında
      lightLevel: (Math.random() * 100).toFixed(2), // 0 ile 100 arasında
    });
  }
  return data;
};

const measurements = generateRandomData(10); // 10 rastgele veri

// X ekseni için saat ve dakika verileri
const xValues = measurements.map(measurement => {
  const date = new Date(measurement.createdAt);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Sadece saat ve dakika
});

// Soil Chart verileri
const soilTemperatureData = measurements.map(measurement => measurement.soilTemperature);
const soilMoistureData = measurements.map(measurement => measurement.soilMoisture);
const soilPHData = measurements.map(measurement => measurement.soilPH);

// Air Chart verileri
const airTemperatureData = measurements.map(measurement => measurement.airTemperature);
const airHumidityData = measurements.map(measurement => measurement.airHumidity);

// Light Level verisi
const lightLevelData = measurements.map(measurement => measurement.lightLevel);

// Chart.js grafiği oluşturma
new Chart("SoilChart", {
  type: "line",
  data: {
    labels: xValues, // Saat ve dakika x ekseninde
    datasets: [{
      data: soilTemperatureData,
      borderColor: "orange",
      
      fill: false
    },{
      data: soilMoistureData,
      borderColor: "green",
     
      fill: false
    },{
      data: soilPHData,
      borderColor: "blue",
      
      fill: false
    }]
  },
  options: {
    legend: { display: false, responsive: true }
  }
});

new Chart("AirChart", {
  type: "line",
  data: {
    labels: xValues, // Saat ve dakika x ekseninde
    datasets: [{
      data: airTemperatureData,
      borderColor: "yellow",
      
      fill: false
    },{
      data: airHumidityData,
      borderColor: "red",
      fill: false
    }]
  },
  options: {
    legend: { display: false }
  }
});

new Chart("LightChart", {
  type: "line",
  data: {
    labels: xValues, // Saat ve dakika x ekseninde
    datasets: [{
      data: lightLevelData,
      borderColor: "gray",
      fill: false
    }]
  },
  options: {
    legend: { display: false }
  }
});

new Chart("BigSoilChart", {
  type: "line",
  data: {
    labels: xValues, // Saat ve dakika x ekseninde
    datasets: [{
      data: soilTemperatureData,
      borderColor: "orange",
      
      fill: false
    },{
      data: soilMoistureData,
      borderColor: "green",
      
      fill: false
    },{
      data: soilPHData,
      borderColor: "blue",
      
      fill: false
    }]
  },
  options: {
    legend: { display: true, responsive: true }
  }
});

new Chart("BigAirChart", {
  type: "line",
  data: {
    labels: xValues, // Saat ve dakika x ekseninde
    datasets: [{
      data: airTemperatureData,
      borderColor: "yellow",
      
      fill: false
    },{
      data: airHumidityData,
      borderColor: "red",
      
      fill: false
    }]
  },
  options: {
    legend: { display: true }
  }
});

new Chart("BigLightChart", {
  type: "line",
  data: {
    labels: xValues, // Saat ve dakika x ekseninde
    datasets: [{
      
      data: lightLevelData,
      borderColor: "gray",
      fill: false
    }]
  },
  options: {
    legend: { display: true }
  }
});


/**
 * Bildirimler kısmı (Rastgele bildirim verileri)
 */

document.addEventListener("DOMContentLoaded", function () {
  const tasksContainer = document.querySelector(".tasks-list"); // Gösterim yapılacak liste

  // Rastgele bildirim verileri
  const generateRandomNotifications = (count) => {
    const notifications = [];
    for (let i = 0; i < count; i++) {
      notifications.push({
        notificationId: i + 1,
        content: `Bildirim #${i + 1}`,
        grade: i % 2 === 0 ? "Yüksek" : "Düşük",
        createdAt: new Date(Date.now() - (i * 1000 * 60 * 10)) // Son 10 dakika içinde
      });
    }
    return notifications;
  };

  const notifications = generateRandomNotifications(5); // 5 rastgele bildirim

  tasksContainer.innerHTML = ""; // Eski içeriği temizle
  notifications.forEach((notification) => {
    const listItem = document.createElement("li");
    listItem.className = "tasks-item";
    listItem.innerHTML = `
      <div class="card task-card">
        <div class="card-input">
          <input type="checkbox" id="task-${notification.notificationId}">
          <label for="task-${notification.notificationId}" class="task-label">
            ${notification.content}
          </label>
        </div>
        <div class="card-badge cyan radius-pill">
          ${new Date(notification.createdAt).toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <ul class="card-meta-list">
          <li>
            <div class="card-badge ${notification.grade.toLowerCase() === "yüksek" ? "red" : "green"}">
              ${notification.grade}
            </div>
          </li>
        </ul>
      </div>
    `;
    tasksContainer.appendChild(listItem);
  });
});
