(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;



  /* ---------- Image lightbox ---------- */
  var lightboxOverlay = document.getElementById('lightboxOverlay');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt){
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightboxOverlay.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }
  document.querySelectorAll('.pc-media').forEach(function(media){
    media.addEventListener('click', function(){
      var img = media.querySelector('img');
      if(img && img.src){ openLightbox(img.src, img.alt); }
    });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', function(e){
    if(e.target === lightboxOverlay){ closeLightbox(); }
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && lightboxOverlay.classList.contains('open')){ closeLightbox(); }
  });


  /* ---------- Deep dive modal ---------- */
  var deepDives = {
    ontdemand: {
      title: 'Ontario Electricity Demand Forecaster',
      tag: 'DATA SCIENCE · MACHINE LEARNING · FORECASTING',
      sections: [
        { label: 'Overview', text: 'A machine learning model that predicts how much electricity Ontario will use each hour, one day in advance, using public data from the provincial grid operator (IESO) and historical weather.' },
        { label: 'The problem', text: 'Electricity supply has to match demand in real time, so the grid needs to know what is coming. The simplest guess is that tomorrow will look like today, but demand swings with the weather, weekends, holidays, and the seasons.' },
        { label: 'How it works', text: 'A Python pipeline downloads 7 years of hourly IESO demand and Toronto temperatures from the Open-Meteo API, then builds 16 features: time of day and year, day of the week, holidays, demand from 24 hours and one week earlier, recent averages, and how far the temperature is above or below 18°C. Every feature has to be known 24 hours ahead, and Pytest unit tests check that no future data leaks in. An XGBoost model trains on 2019–2024.' },
        { label: 'Results', text: 'Tested on all of 2025, a year the model never saw: 3.4% average error (580 MW), with 23% smaller misses than guessing “same as yesterday” (4.6%) and far better than “same as last week” (7.0%). Yesterday’s demand and temperature drive most predictions. Errors are largest on summer afternoons, peaking in July, and the model tends to underestimate heat-wave peaks.' },
        { label: 'Dashboard', text: 'An interactive Streamlit and Plotly dashboard compares predictions with actual demand for any date range, ranks the inputs the model relies on using permutation feature importance, and shows when the model is least accurate.' },
        { label: 'Limitations', text: 'The model is given the temperature that actually happened for the hour it predicts, which assumes a perfect weather forecast, so real-world error would be somewhat higher. Next steps are using weather forecasts, averaging several Ontario cities, and testing across multiple years.' }
      ],
      media: [
        { type: 'image', src: 'assets/images/ontario-demand-dashboard.png', caption: 'The dashboard: headline results and prediction vs reality during the June 2025 heat wave' },
        { type: 'image', src: 'assets/images/ontario-demand-peak-week.png', caption: 'Peak-demand week of 2025: the model (dashed) against the “same as yesterday” guess' },
        { type: 'image', src: 'assets/images/ontario-demand-errors.png', caption: 'When the model is least accurate, by hour of day and by month' }
      ],
      links: [ { label: 'GitHub', url: 'https://github.com/syedzar/Ontario-Electricity-Demand-Forecaster' } ]
    },
    espnode: {
      title: 'ESP32 Wireless Sensor Node',
      tag: 'EMBEDDED · IOT · RTOS',
      sections: [
        { label: 'Overview', text: 'Firmware for an ESP32 that reads temperature and pressure from a sensor over I2C and sends each reading as JSON to a REST API over Wi-Fi.' },
        { label: 'The problem', text: 'The simple approach is a single loop: read the sensor, send the data, wait, repeat. But Wi-Fi calls can be slow, and while the loop is stuck waiting on the network it isn’t reading the sensor, so readings arrive late or get skipped.' },
        { label: 'How it works', text: 'The work is split into two FreeRTOS tasks on the ESP32’s two cores. The sensor task reads every 5 seconds and drops each reading into a queue without ever waiting on the network. The network task takes readings off the queue, keeps Wi-Fi connected, and POSTs them over HTTPS. The queue holds up to 10 readings (about 50 seconds), so a slow network doesn’t lose data.' },
        { label: 'Results', text: 'Tested in the Wokwi ESP32 simulator, which simulates the real chip, the I2C bus, and Wi-Fi with a live internet connection. Over a 4-minute run, 50 of 51 readings (98%) reached the API. The one miss was a POST that failed with a TLS connection error; the firmware logged it and kept sampling on schedule.' },
        { label: 'Status', text: 'Validated in simulation. Next steps are retrying failed POSTs, running it on a physical ESP32 with a BME280 sensor, and sending readings to the Hardware Test Analytics Platform instead of a test webhook.' }
      ],
      media: [
        { type: 'image', src: 'assets/images/esp32-node-simulator.png', caption: 'The simulated circuit, with sensor values set by the sliders' },
        { type: 'image', src: 'assets/images/esp32-node-serial.png', caption: 'Serial output: each reading followed by its HTTP 200 response' },
        { type: 'image', src: 'assets/images/esp32-node-request.png', caption: 'A reading received by the API as JSON (IP and URL redacted)' }
      ],
      links: [ { label: 'GitHub', url: 'https://github.com/syedzar/ESP-SENSOR-NODE' } ]
    },
    htap: {
      title: 'Hardware Test Analytics Platform',
      tag: 'BACKEND \u00b7 DATA \u00b7 TESTING',
      sections: [
        { label: 'Overview', text: 'A backend platform for collecting and analyzing hardware test results, modelled on how an engineering team tracks repeated electrical tests across many devices (here, simulated FPGA boards) instead of scattering results across spreadsheets and terminal output.' },
        { label: 'How it works', text: 'Engineers submit voltage, current, temperature, and duration measurements over a REST API built with FastAPI. The server validates the request, checks the measurements against engineering limits, decides PASS or FAIL itself, records every failure reason, and stores the result in SQLite using parameterized SQL.' },
        { label: 'Analytics', text: 'Stored results can be filtered to failures only, pulled per device, and summarized with SQL aggregates (COUNT, SUM, AVG) into overall and per-device pass rates and average voltage, current, and temperature. A data generator simulates 20 devices and 500 tests to analyze.' },
        { label: 'Design', text: 'API routes, engineering logic, and database code live in separate layers, and input validation (is the request well formed?) is kept distinct from engineering validation (are the measurements within limits?), so the rules can be tested without a web server.' },
        { label: 'Testing', text: '68 automated Pytest tests cover the evaluation rules (including boundary values such as 3.59, 3.60, and 3.61 V), the SQL layer, every endpoint and status code, and SQL injection attempts. GitHub Actions runs the suite on every push, and the app is containerized with Docker.' },
        { label: 'Status', text: 'Runs on simulated data. Reading live measurements from a microcontroller over UART is the planned next step.' }
      ],
      media: [
        { type: 'image', src: 'assets/images/htap-swagger-docs.jpg', caption: 'Interactive API documentation generated by FastAPI' },
        { type: 'image', src: 'assets/images/htap-swagger-statistics.jpg', caption: 'GET /statistics on the simulated 500-test dataset: 436 passed, 87.2% pass rate' }
      ],
      links: [ { label: 'GitHub', url: 'https://github.com/syedzar/Engineering-Test-Analytics-Platform' } ]
    },
    vhdlcpu: {
      title: 'VHDL CPU & UART Interface',
      tag: 'DIGITAL HARDWARE · COMPUTER ARCHITECTURE',
      sections: [
        { label: 'Overview', text: 'A custom 16-bit CPU built from scratch in VHDL for a computer organization course, later extended into a small hardware/software verification system.' },
        { label: 'How it works', text: 'The CPU is assembled from 14 VHDL modules (ALU, register file, instruction and data memory, control logic, and program-counter logic), supporting a custom instruction set (ADD, ADDI, SUB, SUBI, AND, OR, SLT, LW, SW, BNE, JMP). A UART transmitter sits on top of it, so the CPU\u2019s final register state can be serialized and sent to a host machine byte by byte.' },
        { label: 'Verification', text: 'Datapath and control behaviour were checked with VHDL testbenches and waveform analysis across 32 functional test cases, all passing. The full pipeline (CPU \u2192 register-dump FSM \u2192 UART \u2192 host-side C program \u2192 comparison) currently passes 10/10 checks in Vivado simulation.' },
        { label: 'Status', text: 'UART communication was validated in simulation. Testing it over a real serial link on the FPGA board is a possible future extension.' }
      ],
      links: [ { label: 'GitHub', url: 'https://github.com/syedzar/VHDL-CPU-UART-INTERFACE' } ]
    },
    roundrobin: {
      title: 'Round Robin CPU Scheduler',
      tag: 'OPERATING SYSTEMS · SYSTEMS PROGRAMMING',
      sections: [
        { label: 'Overview', text: 'A deterministic Round Robin CPU scheduler simulator written in C, modelling how an OS actually shares a single core across competing processes.' },
        { label: 'Why it matters', text: 'CPU scheduling is one of the core problems in operating systems. This project combines synchronization, ready-queue management, and preemption in a single C-based simulation, using POSIX threads to represent process execution.' },
        { label: 'How it works', text: 'Processes move through the standard states (new, ready, running, blocked, terminated) and are dispatched for a configurable time quantum. A process that doesn\u2019t finish in time is pre-empted and sent to the back of the ready queue.' },
        { label: 'Testing', text: 'Validated across 3 workloads and quantum values 1\u20135, covering arrivals, blocking, wakeups, quantum expiry, and idle CPU periods, with 4 scheduling metrics calculated per task.' }
      ],
      links: [ { label: 'GitHub', url: 'https://github.com/syedzar/Round-Robin-CPU-Scheduler' } ]
    },
    gpyou: {
      title: 'GPYOU: AI GPU Recommendation Platform',
      tag: 'HACKATHON · WEB',
      sections: [
        { label: 'Inspiration', text: 'The GPU market is constantly shifting: dozens of models, confusing specs, and wildly different prices make it genuinely hard to know what to buy.' },
        { label: 'What it does', text: 'GPYOU cuts through that by asking a few key questions, then generating a personalized GPU recommendation tailored to what the user actually needs.' },
        { label: 'How we built it', text: 'We fed a dataset of GPUs and their specs into Gemini 2.0 Flash through the Gemini API and used it to turn a user\u2019s answers into a tailored recommendation, built directly into the prompt sent to the model.' },
        { label: 'Challenges we ran into', text: 'The biggest challenge was wiring the Gemini-powered JavaScript into the HTML/CSS front end. We first tried two separate HTML pages, one for input and one for the recommendation, but sharing a single script across two pages turned out to be inefficient. We fixed it by using two divs that act as pages instead: once a recommendation comes back, the input view hides and the recommendation view takes over.' },
        { label: 'Accomplishments', text: 'We\u2019re proud that we managed to integrate 3D models for most of the GPUs on the list into the recommendation page: if you don\u2019t like how a GPU looks, you\u2019re probably not buying it, so that felt like an essential detail rather than a nice-to-have.' },
        { label: 'What we learned', text: 'None of us had integrated generative AI into a web app before this. Gemini\u2019s ease of use meant we could build a dataset and land on a working prompt for solid recommendations without it eating the whole 48 hours.' },
        { label: 'What\u2019s next', text: 'With a solid foundation in place, the natural next step is expanding beyond GPUs to CPUs, motherboards, RAM, and other PC components.' }
      ],
      links: [ { label: 'Visit site', url: 'https://zainswe.github.io/GPYOU/src/' }, { label: 'Devpost', url: 'https://devpost.com/software/gpyou' } ]
    },
    rover: {
      title: 'Reverse Engineering Rover Assembly',
      tag: 'MECHANICAL · CAD',
      sections: [
        { label: 'Overview', text: 'A reverse-engineering exercise for ENGG*2100, done with a partner, starting from a physical rover assembly and rebuilding it as an accurate CAD model.' },
        { label: 'How it works', text: 'Each of the 15+ components was measured by hand with a caliper, then modelled individually in SOLIDWORKS from those measurements, complete with dimensioned drawings, before being reassembled into a full digital representation of the rover.' },
        { label: 'What went wrong', text: 'The main problem was time. Working under a tight deadline meant several parts were measured and modelled quickly, and that pace let small inaccuracies creep into the dimensions. Those inaccuracies showed up at reassembly: a number of parts didn\u2019t fit together properly and had to be re-measured and rebuilt before the final assembly actually came together.' }
      ],
      media: [
        { type: 'image', src: 'assets/images/rover-assembly-iso.jpg', caption: 'Full rover assembly, modelled in SOLIDWORKS' },
        { type: 'image', src: 'assets/images/rover-part-d4.jpg', caption: 'Part D4 detail drawing' }
      ],
      links: []
    },
    uofgmgmt: {
      title: 'University Student Management System',
      tag: 'SOFTWARE · DESKTOP',
      sections: [
        { label: 'Overview', text: 'A JavaFX desktop application simulating a university\u2019s academic management system, with separate interfaces for students and administrators.' },
        { label: 'Features', text: '10+ screens covering login, dashboards, and course/enrolment viewing for students, plus student, faculty, course, and grade management for administrators, spanning 6 university courses.' },
        { label: 'Built with', text: 'Java and JavaFX, using FXML for the interface layer and controller classes for the underlying logic.' }
      ],
      links: [ { label: 'GitHub', url: 'https://github.com/syedzar/UofG-Management-System' } ]
    },
    teddybear: {
      title: 'Sensor-Guided Electromechanical Mobility Prototype',
      tag: 'ROBOTICS · EMBEDDED',
      sections: [
        { label: 'Overview', text: 'Built for ENGG*1100 with a five-person team, this was a from-scratch mobility platform (chassis, drivetrain, and a mechanical launcher) powered by a single DC motor and steered around a tri-wheel layout with one front wheel, a deliberate departure from the four-wheel designs most other teams used.' },
        { label: 'Engineering analysis', text: 'Before finalizing the design, we ran a full center-of-mass and tipping analysis, weighing and locating every major component (frame, motor, battery pack, launcher, Arduino) to calculate a center of mass at (5.06, 8.75, 8.10) cm and tipping angles of 32\u00b0 and 47\u00b0 along the two axes, which told us how far the chassis could lean before tipping over. We paired that with a material-based life cycle analysis estimating the CO2, methane, and cyanide emissions tied to every electronic and mechanical component used.' },
        { label: 'Electronics and control', text: 'The electronics ran on an Arduino Mega 2560 driving a DC motor through a motor driver, plus a servo for the launch mechanism. I wrote three separate control programs: one for the ramp test, one for a timed forward/backward speed run, and one that sequenced the motor and servo together to fire the launcher, all tuned purely through delay timing rather than closed-loop feedback.' },
        { label: 'Testing outcomes', text: 'On test day, the vehicle scored a perfect 25/25 on the speed course after a quick timing fix following an early stall, and came in at 1068 g against a 1200 g mass limit for a full 15/15. It lost points on the sled pull (7/15) after we deliberately overloaded the sled hoping for a higher score, and on the trash launch (20/30), where the launcher arm turned out to be too short to send the payload any real distance. It passed every safety check outright.' },
        { label: 'Project management', text: 'The build was tracked through a formal work breakdown structure, Gantt chart, and critical path method across a roughly eight-week timeline with five people. Partway through, the team revised its own working agreement, moving from written task tracking to in-person accountability meetings, after realizing the original process wasn\u2019t surfacing enough information between teammates; the change measurably improved how smoothly the final weeks of assembly and testing went.' }
      ],
      media: [
        { type: 'image', src: 'assets/images/mobility-first-iteration.jpg', caption: 'First iteration of design' },
        { type: 'image', src: 'assets/images/mobility-final-build.jpg', caption: 'Final build' }
      ],
      links: []
    }
  };

  var modalOverlay = document.getElementById('modalOverlay');
  var modalTitle = document.getElementById('modalTitle');
  var modalTag = document.getElementById('modalTag');
  var modalBody = document.getElementById('modalBody');
  var modalLinks = document.getElementById('modalLinks');
  var modalClose = document.getElementById('modalClose');

  function openModal(key){
    var data = deepDives[key];
    if(!data){ return; }
    modalTitle.textContent = data.title;
    modalTag.textContent = data.tag;
    modalBody.innerHTML = '';
    data.sections.forEach(function(sec){
      var wrap = document.createElement('div');
      wrap.className = 'modal-section';
      var label = document.createElement('div');
      label.className = 'side-label';
      label.textContent = sec.label;
      var p = document.createElement('p');
      p.textContent = sec.text;
      wrap.appendChild(label);
      wrap.appendChild(p);
      modalBody.appendChild(wrap);
    });
    (data.media || []).forEach(function(m){
      var fig = document.createElement('figure');
      fig.className = 'modal-media';
      var el;
      if(m.type === 'video'){
        el = document.createElement('video');
        el.muted = true;
        el.setAttribute('muted', '');
        el.setAttribute('loop', '');
        el.setAttribute('playsinline', '');
        el.setAttribute('preload', 'metadata');
        if(!reduceMotion){
          el.setAttribute('autoplay', '');
        }
        el.style.cursor = 'pointer';
        el.addEventListener('click', function(){
          if(el.paused){ el.play(); } else { el.pause(); }
        });
      } else {
        el = document.createElement('img');
        el.setAttribute('alt', m.caption || '');
      }
      el.setAttribute('src', m.src);
      fig.appendChild(el);
      if(m.type === 'video'){
        var dl = document.createElement('a');
        dl.href = m.src;
        dl.setAttribute('download', (m.caption || 'clip').replace(/\s+/g, '_') + '.mp4');
        dl.className = 'media-download';
        dl.textContent = 'Download this clip \u2193';
        fig.appendChild(dl);
      }
      if(m.caption){
        var cap = document.createElement('figcaption');
        cap.textContent = m.caption;
        fig.appendChild(cap);
      }
      modalBody.appendChild(fig);
    });
    modalLinks.innerHTML = '';
    (data.links || []).forEach(function(l){
      var a = document.createElement('a');
      a.href = l.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = l.label;
      modalLinks.appendChild(a);
    });
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.link-btn[data-deepdive]').forEach(function(btn){
    btn.addEventListener('click', function(){
      openModal(btn.getAttribute('data-deepdive'));
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', function(e){
    if(e.target === modalOverlay){ closeModal(); }
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && modalOverlay.classList.contains('open')){ closeModal(); }
  });

  /* ---------- Router ---------- */
  /* Click-driven rather than relying on window.location.hash, since a
     sandboxed preview frame can swallow fragment navigation. */
  var routes = ['home','projects','experience','education','contact'];

  function showRoute(route){
    if(routes.indexOf(route) === -1){ route = 'home'; }
    document.querySelectorAll('.page').forEach(function(el){
      el.classList.toggle('active', el.id === route);
    });
    document.querySelectorAll('[data-route]').forEach(function(a){
      a.classList.toggle('active', a.getAttribute('data-route') === route);
    });
    try{ window.scrollTo(0, 0); }catch(e){}
    try{ history.replaceState(null, '', '#' + route); }catch(e){}
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
    document.getElementById('menuToggle').setAttribute('aria-expanded','false');
  }

  document.querySelectorAll('[data-route]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      showRoute(el.getAttribute('data-route'));
    });
  });

  var startRoute = (window.location.hash || '').replace('#','');
  showRoute(startRoute || 'home');

  /* ---------- Circuit-trace background ---------- */
  var canvas = document.getElementById('stars');
  var ctx = canvas.getContext('2d');
  var circuitPaths = [];
  var circuitVias = [];
  var circuitChips = [];

  function buildBus(){
    var horizontal = Math.random() > 0.5;
    var lineCount = 3 + Math.floor(Math.random() * 6);
    var spacing = 5 + Math.random() * 4;
    var baseX = Math.random() * canvas.width;
    var baseY = Math.random() * canvas.height;
    var chamfer = 10 + Math.random() * 6;
    var willTurn = Math.random() > 0.3;
    var turnDir = Math.random() > 0.5 ? 1 : -1;
    var paths = [];
    var vias = [];
    for(var i = 0; i < lineCount; i++){
      var offset = i * spacing;
      var len1 = 90 + Math.random() * 220;
      var len2 = 50 + Math.random() * 160;
      var pts;
      if(horizontal){
        var y = baseY + offset;
        var x1 = baseX + len1;
        pts = [[baseX, y]];
        if(willTurn && Math.random() > 0.25){
          pts.push([x1 - chamfer, y]);
          pts.push([x1, y + chamfer * turnDir]);
          pts.push([x1, y + turnDir * len2]);
        } else {
          pts.push([x1, y]);
        }
      } else {
        var x = baseX + offset;
        var y1 = baseY + len1;
        pts = [[x, baseY]];
        if(willTurn && Math.random() > 0.25){
          pts.push([x, y1 - chamfer]);
          pts.push([x + chamfer * turnDir, y1]);
          pts.push([x + turnDir * len2, y1]);
        } else {
          pts.push([x, y1]);
        }
      }
      paths.push(pts);
      var last = pts[pts.length - 1];
      vias.push({ x: last[0], y: last[1], r: Math.random() > 0.7 ? 2.2 : 1.3 });
      if(Math.random() > 0.55){
        vias.push({ x: pts[0][0], y: pts[0][1], r: 1.2 });
      }
    }
    return { paths: paths, vias: vias };
  }

  function buildChip(){
    var w = 22 + Math.random() * 34;
    var h = 14 + Math.random() * 14;
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    var pinsTop = 3 + Math.floor(Math.random() * 4);
    var pinsSide = 2 + Math.floor(Math.random() * 3);
    return { x: x, y: y, w: w, h: h, pinsTop: pinsTop, pinsSide: pinsSide };
  }

  function generateCircuit(){
    var area = canvas.width * canvas.height;
    var busCount = Math.max(10, Math.floor(area / 26000));
    var chipCount = Math.max(3, Math.floor(area / 190000));
    circuitPaths = [];
    circuitVias = [];
    circuitChips = [];
    for(var i = 0; i < busCount; i++){
      var bus = buildBus();
      circuitPaths = circuitPaths.concat(bus.paths);
      circuitVias = circuitVias.concat(bus.vias);
    }
    for(var j = 0; j < chipCount; j++){
      circuitChips.push(buildChip());
    }
  }

  function drawCircuit(){
    if(!ctx){ return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var lightMode = document.documentElement.classList.contains('light');
    var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7dd3fc';
    ctx.strokeStyle = accent;
    ctx.fillStyle = accent;
    ctx.lineWidth = 1;
    ctx.globalAlpha = lightMode ? 0.11 : 0.20;

    circuitPaths.forEach(function(pts){
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for(var i = 1; i < pts.length; i++){
        ctx.lineTo(pts[i][0], pts[i][1]);
      }
      ctx.stroke();
    });

    circuitVias.forEach(function(v){
      ctx.beginPath();
      ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
      ctx.fill();
    });

    circuitChips.forEach(function(chip){
      ctx.strokeRect(chip.x, chip.y, chip.w, chip.h);
      var i, px;
      for(i = 0; i < chip.pinsTop; i++){
        px = chip.x + (chip.w / (chip.pinsTop + 1)) * (i + 1);
        ctx.beginPath();
        ctx.moveTo(px, chip.y);
        ctx.lineTo(px, chip.y - 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px, chip.y + chip.h);
        ctx.lineTo(px, chip.y + chip.h + 6);
        ctx.stroke();
      }
      for(i = 0; i < chip.pinsSide; i++){
        var py = chip.y + (chip.h / (chip.pinsSide + 1)) * (i + 1);
        ctx.beginPath();
        ctx.moveTo(chip.x, py);
        ctx.lineTo(chip.x - 6, py);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(chip.x + chip.w, py);
        ctx.lineTo(chip.x + chip.w + 6, py);
        ctx.stroke();
      }
    });

    ctx.globalAlpha = 1;
  }

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateCircuit();
    drawCircuit();
  }

  window.addEventListener('resize', resize);
  resize();

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var isLight = false;
  function applyTheme(){
    document.documentElement.classList.toggle('light', isLight);
    themeToggle.innerHTML = isLight ? '&#9788;' : '&#9789;';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    drawCircuit();
  }
  themeToggle.addEventListener('click', function(){
    isLight = !isLight;
    applyTheme();
  });
  applyTheme();

  /* ---------- Mobile menu toggle ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var sidebar = document.getElementById('sidebar');
  menuToggle.addEventListener('click', function(){
    var isOpen = sidebar.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  /* ---------- Terminal boot sequence ---------- */
  var bootLines = [
    { text: 'guest@zaryan:~$ whoami', cls: '' },
    { text: 'Zaryan Syed | Computer Engineering, University of Guelph', cls: 'tl-dim' },
    { text: '', cls: '' },
    { text: 'guest@zaryan:~$ ./verify_cpu --uart', cls: '' },
    { text: '[FSM] register dump initiated...', cls: 'tl-dim' },
    { text: '[UART] TX 8N1 @ 9600 baud...', cls: 'tl-dim' },
    { text: '[HOST] comparing register state...', cls: 'tl-dim' },
    { text: '10 / 10 PASS', cls: 'tl-accent' },
    { text: '', cls: '' },
    { text: 'guest@zaryan:~$ ', cls: '', cursor: true }
  ];

  var bootEl = document.getElementById('bootSeq');

  function renderStatic(){
    bootEl.innerHTML = '';
    bootLines.forEach(function(line){
      var span = document.createElement('span');
      if(line.cls){ span.className = line.cls; }
      span.textContent = line.text;
      bootEl.appendChild(span);
      if(line.cursor){
        var cursor = document.createElement('span');
        cursor.className = 'tl-cursor';
        bootEl.appendChild(cursor);
      }
      bootEl.appendChild(document.createTextNode('\n'));
    });
  }

  function typeSequence(){
    var lineIndex = 0;
    var charIndex = 0;

    function nextChar(){
      if(lineIndex >= bootLines.length){ return; }
      var line = bootLines[lineIndex];

      if(charIndex === 0){
        var span = document.createElement('span');
        if(line.cls){ span.className = line.cls; }
        span.setAttribute('data-line', lineIndex);
        bootEl.appendChild(span);
      }

      var span = bootEl.querySelector('[data-line="'+lineIndex+'"]');

      if(charIndex < line.text.length){
        span.textContent += line.text.charAt(charIndex);
        charIndex++;
        setTimeout(nextChar, 12 + Math.random()*10);
      } else {
        if(line.cursor){
          var cursor = document.createElement('span');
          cursor.className = 'tl-cursor';
          bootEl.appendChild(cursor);
        }
        bootEl.appendChild(document.createTextNode('\n'));
        lineIndex++;
        charIndex = 0;
        setTimeout(nextChar, 260);
      }
    }
    nextChar();
  }

  if(reduceMotion){
    renderStatic();
  } else {
    typeSequence();
  }

})();
