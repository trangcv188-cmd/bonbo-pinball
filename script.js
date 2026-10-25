/**
 * BONBO PINBALL B2B — CLIENT INTERACTIVITY & CALCULATION ENGINE
 * Framework-free, zero-dependency, high-speed execution
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. FORMATTING UTILITIES
  // =========================================================================
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount).replace('₫', 'đ');
  };

  // =========================================================================
  // 2. INTERACTIVE ROI & PAYBACK CALCULATOR
  // =========================================================================
  const rangeMachines = document.getElementById('range-machines');
  const rangePlays = document.getElementById('range-plays');
  const valMachines = document.getElementById('val-machines');
  const valPlays = document.getElementById('val-plays');
  const valTicketText = document.getElementById('val-ticket-text');
  const ticketBtns = document.querySelectorAll('.ticket-btn');
  const modelToggleBtns = document.querySelectorAll('.model-toggle-btn');

  // Result displays
  const resGross = document.getElementById('res-gross');
  const resCost = document.getElementById('res-cost');
  const resNet = document.getElementById('res-net');
  const resNetSub = document.getElementById('res-net-sub');
  const resPayback = document.getElementById('res-payback');
  const resCapex = document.getElementById('res-capex');
  const calcModeTag = document.getElementById('calc-mode-tag');
  const rowCosts = document.getElementById('row-costs');
  const boxPayback = document.getElementById('box-payback');

  let currentTicketPrice = 20000;
  let currentCalcMode = 'buy'; // 'buy' or 'share'

  function calculateROI() {
    const machines = parseInt(rangeMachines?.value || 3, 10);
    const playsPerDay = parseInt(rangePlays?.value || 40, 10);
    
    // Update live indicators
    if (valMachines) valMachines.textContent = machines;
    if (valPlays) valPlays.textContent = playsPerDay;

    const daysInMonth = 30;
    const totalPlaysMonth = machines * playsPerDay * daysInMonth;
    const grossRevenue = totalPlaysMonth * currentTicketPrice;

    if (currentCalcMode === 'buy') {
      // Capex calculation: 18m if 10+ machines, else 20m
      const unitPrice = machines >= 10 ? 18000000 : 20000000;
      const totalCapex = machines * unitPrice;

      // Realistic gift landed cost is approx 28-30% of turnover + 300k electricity/machine
      const giftCost = Math.round(grossRevenue * 0.28);
      const electricityCost = machines * 300000;
      const totalCost = giftCost + electricityCost;
      const netProfit = grossRevenue - totalCost;

      // Payback months
      const paybackMonths = netProfit > 0 ? (totalCapex / netProfit).toFixed(1) : '∞';

      // Update UI
      if (calcModeTag) calcModeTag.textContent = 'Phương án: Mua máy sở hữu (Hưởng 100% doanh thu)';
      if (resGross) resGross.textContent = formatVND(grossRevenue);
      if (rowCosts) rowCosts.style.display = 'flex';
      if (resCost) resCost.textContent = `- ${formatVND(totalCost)}`;
      if (resNetSub) resNetSub.textContent = 'Sau chi phí quà & điện nước vận hành';
      if (resNet) resNet.textContent = formatVND(netProfit);
      
      if (boxPayback) boxPayback.style.display = 'flex';
      if (resPayback) resPayback.textContent = paybackMonths;
      if (resCapex) resCapex.textContent = formatVND(totalCapex);
    } else {
      // Revenue sharing mode (0 Capex, Partner receives 25% net share)
      const partnerShareRate = 0.25;
      const partnerNetProfit = Math.round(grossRevenue * partnerShareRate);

      if (calcModeTag) calcModeTag.textContent = 'Phương án: Hợp tác mặt bằng 0đ vốn (Nhận 25% chia sẻ)';
      if (resGross) resGross.textContent = formatVND(grossRevenue);
      if (rowCosts) rowCosts.style.display = 'none'; // Việt Core bears costs
      if (resNetSub) resNetSub.textContent = 'Hoa hồng thực nhận hàng tháng (0đ chi phí)';
      if (resNet) resNet.textContent = formatVND(partnerNetProfit);

      if (boxPayback) boxPayback.style.display = 'none'; // No capex, instant return
    }
  }

  // Event Listeners for calculator
  rangeMachines?.addEventListener('input', calculateROI);
  rangePlays?.addEventListener('input', calculateROI);

  ticketBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ticketBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTicketPrice = parseInt(btn.dataset.val, 10);
      if (valTicketText) valTicketText.textContent = formatVND(currentTicketPrice);
      calculateROI();
    });
  });

  modelToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modelToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCalcMode = btn.dataset.mode;
      calculateROI();
    });
  });

  // Run initial calculation
  calculateROI();

  // =========================================================================
  // 3. SEGMENT SWITCHER (TABS)
  // =========================================================================
  const segmentTabs = document.querySelectorAll('.segment-tab-btn');
  const segmentPanels = document.querySelectorAll('.segment-panel');

  segmentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;

      segmentTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      segmentPanels.forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.hidden = false;
      }
    });
  });

  // =========================================================================
  // 4. MODEL SELECTION PRE-FILL TO LEAD FORM
  // =========================================================================
  const selectModelBtns = document.querySelectorAll('.select-model-btn');
  const selectInterest = document.getElementById('select-interest');

  selectModelBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const model = btn.dataset.model;
      if (selectInterest && model) {
        for (let i = 0; i < selectInterest.options.length; i++) {
          if (selectInterest.options[i].value.includes(model)) {
            selectInterest.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // =========================================================================
  // 5. LEAD FORM VALIDATION & SUBMISSION
  // =========================================================================
  const leadForm = document.getElementById('b2b-lead-form');
  const formMsg = document.getElementById('form-msg');
  const formSuccessBox = document.getElementById('form-success-box');
  const leadCodeElem = document.getElementById('lead-code');
  const btnSubmitLead = document.getElementById('btn-submit-lead');

  leadForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const phoneInput = document.getElementById('contact-phone');
    const companyInput = document.getElementById('contact-company');
    const modelInput = document.getElementById('select-model');
    const interestInput = document.getElementById('select-interest');
    const qtyInput = document.getElementById('contact-qty');
    const notesInput = document.getElementById('contact-notes');

    const nameErr = document.getElementById('name-err');
    const phoneErr = document.getElementById('phone-err');

    let isValid = true;

    // Reset error messages
    if (nameErr) nameErr.textContent = '';
    if (phoneErr) phoneErr.textContent = '';

    // Validate Name
    if (!nameInput.value.trim()) {
      if (nameErr) nameErr.textContent = 'Vui lòng nhập họ và tên liên hệ.';
      nameInput.focus();
      isValid = false;
    }

    // Validate Phone (Vietnamese format 9-11 digits)
    const phoneRegex = /^[0-9+.\s-]{9,15}$/;
    if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
      if (phoneErr) phoneErr.textContent = 'Vui lòng nhập số điện thoại hợp lệ.';
      if (isValid) phoneInput.focus();
      isValid = false;
    }

    if (!isValid) return;

    // Generate random realistic lead tracking code
    const randomCode = 'VC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    if (leadCodeElem) leadCodeElem.textContent = randomCode;

    // Build lead payload
    const leadData = {
      code: randomCode,
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      company: companyInput.value.trim() || 'Chưa cung cấp',
      venueType: modelInput.value,
      cooperationMode: interestInput.value,
      quantity: qtyInput.value,
      notes: notesInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    // Store in localStorage for audit & persistence
    try {
      const stored = JSON.parse(localStorage.getItem('bonbo_b2b_leads') || '[]');
      stored.unshift(leadData);
      localStorage.setItem('bonbo_b2b_leads', JSON.stringify(stored));
    } catch (err) {
      console.warn('Storage failed:', err);
    }

    // Change button state
    if (btnSubmitLead) {
      btnSubmitLead.disabled = true;
      btnSubmitLead.innerHTML = '<span>Đang gửi thông tin...</span>';
    }

    // Simulate instant secure processing & reveal success confirmation
    setTimeout(() => {
      leadForm.style.display = 'none';
      if (formSuccessBox) formSuccessBox.hidden = false;

      // Automatically trigger DOCX dossier download for maximum customer satisfaction
      const downloadLink = document.createElement('a');
      downloadLink.href = 'assets/ho-so-thuyet-minh-bonbo-pinball.docx';
      downloadLink.download = 'ho-so-thuyet-minh-bonbo-pinball.docx';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }, 600);
  });

  // =========================================================================
  // 6. DASHBOARD SIMULATOR REFRESH INTERACTION
  // =========================================================================
  const btnRefreshDash = document.getElementById('btn-refresh-dash');
  btnRefreshDash?.addEventListener('click', () => {
    btnRefreshDash.textContent = 'Đang đồng bộ...';
    btnRefreshDash.disabled = true;
    setTimeout(() => {
      btnRefreshDash.textContent = 'Đã cập nhật vừa xong';
      setTimeout(() => {
        btnRefreshDash.textContent = 'Làm mới dữ liệu';
        btnRefreshDash.disabled = false;
      }, 2000);
    }, 800);
  });

  // =========================================================================
  // 7. MOBILE MENU TOGGLE
  // =========================================================================
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.contains('open');
    navLinks?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });
});
