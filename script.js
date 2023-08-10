window.lastAlarm = {};
var sound = new Audio();
sound.src = 'a.wav';



var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var month = ["January", "February", "March", "April", "May", "June", "July", "Augustus", "September", "October", "November", "Desember"];
var newDate = new Date();
newDate.setDate(newDate.getDate());

$('#date').html(week[newDate.getDay()] + "," + " " + newDate.getDate() + " " + month[newDate.getMonth()] + " " + newDate.getFullYear());

var timerID = setInterval(updateTime, 1000);
updateTime()

function updateTime() {
  app.time = new Date();
}




 
$(function() {
  app = new Vue({
    el: "#app",
    data: {
      time: new Date(), 
      alarm_going_off: false,
      alarms: []
    },
    mounted: function() {
      if (localStorage.alarms) {
        this.alarms = JSON.parse(localStorage.alarms);
      }
      setTimeout(updateTime, 1000);
    },
    methods: {
      saveAlarm: function() {
          new_alarm = {
            hour: $("#hour option:selected").text(),
            minute: parseInt($("#minute option:selected").text()),
            message: $("#alarm_message").val(),
            am_pm: $("#am_pm option:selected").text()
          };
          this.alarms.push(new_alarm);
          $("#alarm_message").val("");
      },
      stopAlarm: function() {
        this.alarm_going_off = false;
        sound.pause();
      },
      deleteAlarm: function(toRemove) {
        new_alarms = [];
        $.each(this.alarms, function(i, v) {
          if (i != toRemove) {
            new_alarms.push(v);
          }
        });
        this.alarms = new_alarms;
        stopAlarm(); 
      },
      enableAlarm: function() {
          const btn = document.getElementById('btn');
          btn.addEventListener('click', function handleClick() {
            const initialText = 'Enable';
        
            if (btn.textContent.toLowerCase().includes(initialText.toLowerCase())) {
              btn.textContent = 'Disable';
            } else {
              btn.textContent = initialText;
            }
        })
      }
     
    },
    watch: {
      alarms: function(newValue) {
        localStorage.setItem("alarms", JSON.stringify(newValue));
      },
      time: function(newValue) {
        if (this.alarm_going_off) {
          return;
        }
        $.each(this.alarms, function(i, alarm) {
          hours = app.time.getHours() % 12;
          if (hours == 0) {
            hours = 12;
          }
          am_pm = "PM";
          if (app.time.getHours() < 12) {
            am_pm = "AM";
          }
          if (
            parseInt(alarm.hour) == parseInt(hours) &&
            parseInt(alarm.minute) == app.time.getMinutes() &&
            alarm.am_pm == am_pm
          ) {
            if (JSON.stringify(alarm) != JSON.stringify(window.lastAlarm)) {
              app.alarm_going_off = true;
              window.lastAlarm = alarm;
              sound.loop = true;
              sound.play();
              return;
            }
          } else {
            window.lastAlarm = {};
          }
        });
      }
    }
  });
});