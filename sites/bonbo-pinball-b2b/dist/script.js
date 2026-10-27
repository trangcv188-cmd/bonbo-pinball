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
  const resOtherCost = document.getElementById('res-other-cost');
  const resNet = document.getElementById('res-net');
  const resNetSub = document.getElementById('res-net-sub');
  const resPayback = document.getElementById('res-payback');
  const resCapex = document.getElementById('res-capex');
  const calcModeTag = document.getElementById('calc-mode-tag');
  const rowCosts = document.getElementById('row-costs');
  const rowOtherCost = document.getElementById('row-other-cost');
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

      // Chi phí quà tặng: ~30% doanh thu
      const giftCost = Math.round(grossRevenue * 0.30);
      // Mặt bằng & các chi phí khác (thuê điểm đặt, điện, 4G, bảo trì): ~35% doanh thu
      const otherCost = Math.round(grossRevenue * 0.35);
      const totalCost = giftCost + otherCost;
      // Lợi nhuận ròng: 35% doanh thu (khống chế chuẩn trong khoảng 30% - 40%)
      const netProfit = grossRevenue - totalCost;

      // Payback months
      const paybackMonths = netProfit > 0 ? (totalCapex / netProfit).toFixed(1) : '∞';

      // Update UI
      if (calcModeTag) calcModeTag.textContent = 'Phương án: Mua máy sở hữu (Hưởng trọn lợi nhuận điểm đặt)';
      if (resGross) resGross.textContent = formatVND(grossRevenue);
      if (rowCosts) rowCosts.style.display = 'flex';
      if (rowOtherCost) rowOtherCost.style.display = 'flex';
      if (resCost) resCost.textContent = `- ${formatVND(giftCost)}`;
      if (resOtherCost) resOtherCost.textContent = `- ${formatVND(otherCost)}`;
      if (resNetSub) resNetSub.textContent = 'Sau chi phí quà, mặt bằng & các chi phí khác';
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
      if (rowOtherCost) rowOtherCost.style.display = 'none';
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

  // =========================================================================
  // 8. INVESTMENT REASONS TABS (HERO SECTION)
  // =========================================================================
  const reasonTabs = document.querySelectorAll('.reason-tab-btn');
  const reasonPanels = document.querySelectorAll('.reason-panel');

  reasonTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;

      reasonTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      reasonPanels.forEach(p => {
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
  // 9. HERO IMAGE AUTO-SLIDER (4 IMAGES, 2s ROTATION)
  // =========================================================================
  const heroSlider = document.getElementById('hero-slider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    const dots = heroSlider.querySelectorAll('.hero-dot');
    const prevBtn = heroSlider.querySelector('.hero-slider-prev');
    const nextBtn = heroSlider.querySelector('.hero-slider-next');
    let currentSlide = 0;
    let slideTimer = null;
    const INTERVAL_MS = 3000; // 3 seconds

    function showSlide(index) {
      if (index < 0) {
        currentSlide = slides.length - 1;
      } else if (index >= slides.length) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }

      slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    }

    function startAutoSlide() {
      stopAutoSlide();
      slideTimer = setInterval(() => {
        showSlide(currentSlide + 1);
      }, INTERVAL_MS);
    }

    function stopAutoSlide() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    prevBtn?.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoSlide();
    });

    nextBtn?.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoSlide();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startAutoSlide();
      });
    });

    heroSlider.addEventListener('mouseenter', stopAutoSlide);
    heroSlider.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
  }

  // =========================================================================
  // 4. 6 REASONS INTERACTIVE SLIDER (5s interval + smooth transitions)
  // =========================================================================
  const reasonSlides = document.querySelectorAll('.reason-slide');
  const reasonStepBtns = document.querySelectorAll('.reason-step-btn');
  const reasonPrevBtn = document.querySelector('.reason-nav-btn.prev');
  const reasonNextBtn = document.querySelector('.reason-nav-btn.next');
  const reasonCounter = document.getElementById('reason-counter');
  let currentReasonIdx = 0;
  let reasonAutoInterval = null;

  function showReasonSlide(idx) {
    if (!reasonSlides.length) return;
    if (idx < 0) idx = reasonSlides.length - 1;
    if (idx >= reasonSlides.length) idx = 0;
    currentReasonIdx = idx;

    reasonSlides.forEach((slide, i) => {
      if (i === idx) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    reasonStepBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
    });

    if (reasonCounter) {
      reasonCounter.textContent = '0' + (idx + 1) + ' / 0' + reasonSlides.length;
    }
  }

  function nextReasonSlide() {
    showReasonSlide(currentReasonIdx + 1);
  }

  function prevReasonSlide() {
    showReasonSlide(currentReasonIdx - 1);
  }

  function startReasonAutoPlay() {
    stopReasonAutoPlay();
    reasonAutoInterval = setInterval(nextReasonSlide, 5000);
  }

  function stopReasonAutoPlay() {
    if (reasonAutoInterval) {
      clearInterval(reasonAutoInterval);
      reasonAutoInterval = null;
    }
  }

  if (reasonSlides.length) {
    reasonStepBtns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        showReasonSlide(i);
        startReasonAutoPlay();
      });
    });

    reasonNextBtn?.addEventListener('click', () => {
      nextReasonSlide();
      startReasonAutoPlay();
    });

    reasonPrevBtn?.addEventListener('click', () => {
      prevReasonSlide();
      startReasonAutoPlay();
    });

    const bannerEl = document.querySelector('.gameplay-visual-banner');
    if (bannerEl) {
      bannerEl.addEventListener('mouseenter', stopReasonAutoPlay);
      bannerEl.addEventListener('mouseleave', startReasonAutoPlay);
    }

    startReasonAutoPlay();
  }

  // =========================================================================
  // 5. DEPLOYMENT LOCATIONS AUTO-SLIDER (3s interval + interactive sync)
  // =========================================================================
  const deploySlides = document.querySelectorAll('.deployment-slide');
  const deployDots = document.querySelectorAll('.deploy-dot');
  const deployPrevBtn = document.querySelector('.deployment-nav-btn.prev');
  const deployNextBtn = document.querySelector('.deployment-nav-btn.next');
  const placeBoxes = document.querySelectorAll('.place-box-item');
  let currentDeployIdx = 0;
  let deployAutoInterval = null;

  function showDeploySlide(idx) {
    if (!deploySlides.length) return;
    if (idx < 0) idx = deploySlides.length - 1;
    if (idx >= deploySlides.length) idx = 0;
    currentDeployIdx = idx;

    deploySlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });

    deployDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });

    placeBoxes.forEach((box) => {
      const rawTarget = box.getAttribute('data-slide-target');
      const targets = rawTarget ? rawTarget.split(',').map(s => parseInt(s.trim(), 10)) : [];
      if (targets.includes(idx)) {
        box.classList.add('active');
      } else {
        box.classList.remove('active');
      }
    });
  }

  function nextDeploySlide() {
    showDeploySlide(currentDeployIdx + 1);
  }

  function prevDeploySlide() {
    showDeploySlide(currentDeployIdx - 1);
  }

  function startDeployAutoPlay() {
    stopDeployAutoPlay();
    deployAutoInterval = setInterval(nextDeploySlide, 3000);
  }

  function stopDeployAutoPlay() {
    if (deployAutoInterval) {
      clearInterval(deployAutoInterval);
      deployAutoInterval = null;
    }
  }

  if (deploySlides.length) {
    deployNextBtn?.addEventListener('click', () => {
      nextDeploySlide();
      startDeployAutoPlay();
    });

    deployPrevBtn?.addEventListener('click', () => {
      prevDeploySlide();
      startDeployAutoPlay();
    });

    deployDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showDeploySlide(i);
        startDeployAutoPlay();
      });
    });

    placeBoxes.forEach((box) => {
      box.addEventListener('click', () => {
        const rawTarget = box.getAttribute('data-slide-target');
        const firstTarget = rawTarget ? parseInt(rawTarget.split(',')[0].trim(), 10) : 0;
        placeBoxes.forEach(b => b.classList.remove('active'));
        box.classList.add('active');
        if (!isNaN(firstTarget)) {
          showDeploySlide(firstTarget);
        }
        startDeployAutoPlay();
      });
    });

    const showcaseWrap = document.querySelector('.deployment-slider-wrap');
    if (showcaseWrap) {
      showcaseWrap.addEventListener('mouseenter', stopDeployAutoPlay);
      showcaseWrap.addEventListener('mouseleave', startDeployAutoPlay);
    }

    startDeployAutoPlay();
  }

  // =========================================================================
  // 6. REAL SOFTWARE SHOWCASE (TABS & LAPTOP SCREEN SWITCHER)
  // =========================================================================
  const softwareTabBtns = document.querySelectorAll('.software-tab-btn');
  const softwarePanels = document.querySelectorAll('.software-panel');
  const laptopNavItems = document.querySelectorAll('.screen-nav-item');
  const laptopSlides = document.querySelectorAll('.laptop-slide');

  // Tab switching (Laptop vs Mobile)
  if (softwareTabBtns.length) {
    softwareTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        softwareTabBtns.forEach(b => {
          const isActive = (b === btn);
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        softwarePanels.forEach(panel => {
          if (panel.id === `panel-${targetTab}`) {
            panel.classList.add('active');
            panel.removeAttribute('hidden');
          } else {
            panel.classList.remove('active');
            panel.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  // Laptop Screen Switcher (Screen 1, Screen 2, Screen 3)
  if (laptopNavItems.length && laptopSlides.length) {
    laptopNavItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        laptopNavItems.forEach((nav, i) => {
          nav.classList.toggle('active', i === idx);
        });
        laptopSlides.forEach((slide, i) => {
          slide.classList.toggle('active', i === idx);
        });
      });
    });
  }
});
