const fs = require('fs');
const path = require('path');
const sharp = require('C:/Users/ASUS Zenbook/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

const root = __dirname;
const sourcePhoto = 'C:/Trang Nguyễn/Starthing/Bumbum/máy bán hàng +/Bắn bi/ảnh/IMG_2355.JPG';
const outputPng = path.join(root, 'infographic-pinball-gia-thong-so-1200x1200.png');
const outputSvg = path.join(root, 'infographic-pinball-gia-thong-so.svg');

function esc(s) {
  return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function t(x, y, value, size, color, opts = '') {
  return `<text x="${x}" y="${y}" font-family="Times New Roman" font-size="${size}" fill="${color}" ${opts}>${esc(value)}</text>`;
}

function spec(x, y, label, value, valueSize = 31) {
  return `<rect x="${x}" y="${y}" width="282" height="112" rx="16" fill="#edf8ff" stroke="#c5e6fb" stroke-width="1.5"/>` +
    t(x + 20, y + 35, label, 20, '#356382', 'font-weight="bold" letter-spacing="0.7"') +
    t(x + 20, y + 82, value, valueSize, '#082e4e', 'font-weight="bold"');
}

async function main() {
  // Crop only one actual machine from the user-provided installation photo.
  // The infographic itself retains the unaltered photo's appearance.
  let photo;
  if (fs.existsSync(sourcePhoto)) {
    const upright = await sharp(sourcePhoto).rotate().toBuffer();
    photo = await sharp(upright)
      .extract({ left: 650, top: 300, width: 2950, height: 5050 })
      .resize(860, 1470, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 94 })
      .toBuffer();
  } else {
    photo = await sharp(path.join(root, 'dossier_assets', 'front.jpg'))
      .extract({ left: 0, top: 0, width: 825, height: 2200 })
      .resize(860, 1470, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 94 })
      .toBuffer();
  }
  const photo64 = photo.toString('base64');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="1200" viewBox="0 0 1200 1200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#031c36"/><stop offset="0.48" stop-color="#07527f"/><stop offset="1" stop-color="#1ca4d4"/>
    </linearGradient>
    <linearGradient id="price" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#e2f8ff"/><stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <linearGradient id="bottom" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#064b78"/><stop offset="1" stop-color="#067db0"/>
    </linearGradient>
    <clipPath id="photoClip"><rect x="58" y="190" width="430" height="752" rx="25"/></clipPath>
  </defs>
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <circle cx="1190" cy="-80" r="410" fill="#2abced" opacity="0.09"/>
  <circle cx="-70" cy="1120" r="330" fill="#38d1ff" opacity="0.07"/>
  <path d="M0 158 H1200" stroke="#b1efff" stroke-opacity="0.28" stroke-width="2"/>
  ${t(58, 81, 'MÁY BẮN BI PINBALL', 50, '#ffffff', 'font-weight="bold"')}
  ${t(60, 131, 'GIÁ BÁN &amp; THÔNG SỐ KỸ THUẬT'.replace('&amp;', '&'), 29, '#a5eafe', 'font-weight="bold" letter-spacing="1.1"')}

  <rect x="54" y="186" width="438" height="760" rx="29" fill="#b9efff" opacity="0.38"/>
  <image x="58" y="190" width="430" height="752" xlink:href="data:image/jpeg;base64,${photo64}" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice"/>
  <rect x="58" y="857" width="430" height="85" fill="#03243f" opacity="0.82" clip-path="url(#photoClip)"/>
  ${t(83, 910, 'ẢNH MÁY THỰC TẾ', 27, '#ffffff', 'font-weight="bold" letter-spacing="1"')}

  <rect x="516" y="190" width="626" height="228" rx="26" fill="url(#price)"/>
  <rect x="516" y="190" width="13" height="228" rx="6" fill="#18b4dc"/>
  ${t(548, 230, 'GIÁ BÁN', 22, '#376e90', 'font-weight="bold" letter-spacing="1.3"')}
  ${t(548, 292, '20.000.000đ', 55, '#073b62', 'font-weight="bold"')}
  ${t(922, 291, '/ máy', 27, '#285d7f')}
  <line x1="548" y1="311" x2="1107" y2="311" stroke="#bddfeb" stroke-width="2"/>
  ${t(548, 350, 'Từ 10 máy: 18.000.000đ/máy', 27, '#0d6f9e', 'font-weight="bold"')}
  ${t(548, 388, 'Gồm máy, phần mềm quản lý, bộ thanh toán và 1 ghế.', 20, '#34637f')}

  <rect x="516" y="441" width="626" height="501" rx="26" fill="#ffffff"/>
  ${t(545, 484, 'THÔNG SỐ CƠ BẢN', 28, '#0a4167', 'font-weight="bold" letter-spacing="0.8"')}
  <line x1="545" y1="499" x2="1112" y2="499" stroke="#c3e4f2" stroke-width="2"/>
  ${spec(545, 520, 'KÍCH THƯỚC (R × S × C)', '510 × 778 × 1.700 mm', 26)}
  ${spec(837, 520, 'TRỌNG LƯỢNG', '~60 kg', 33)}
  ${spec(545, 642, 'NGUỒN ĐIỆN', '220 V', 33)}
  ${spec(837, 642, 'CÔNG SUẤT', '100–120 W', 33)}
  ${spec(545, 764, 'NGĂN QUÀ', '9 ngăn', 33)}
  ${spec(837, 764, 'DIỆN TÍCH BỐ TRÍ', '~1 m²/máy', 32)}
  ${t(548, 917, 'Màn hình điểm điện tử  •  Đèn LED  •  Kết nối Internet', 21, '#436b84')}

  <rect x="58" y="965" width="1084" height="158" rx="26" fill="url(#bottom)" stroke="#6fddf7" stroke-opacity="0.55" stroke-width="2"/>
  ${t(87, 1008, 'TIỆN ÍCH VẬN HÀNH', 25, '#bbf4ff', 'font-weight="bold" letter-spacing="0.7"')}
  <circle cx="94" cy="1057" r="5" fill="#55dbff"/>${t(111, 1066, 'Tiền mặt &amp; QR'.replace('&amp;', '&'), 24, '#ffffff', 'font-weight="bold"')}
  <circle cx="390" cy="1057" r="5" fill="#55dbff"/>${t(407, 1066, 'Tự động trả quà', 24, '#ffffff', 'font-weight="bold"')}
  <circle cx="706" cy="1057" r="5" fill="#55dbff"/>${t(723, 1066, 'Quản lý từ xa', 24, '#ffffff', 'font-weight="bold"')}
  ${t(88, 1102, 'Người chơi bắn bi tích điểm; máy mở ngăn quà khi đủ điểm.', 22, '#daeff8')}
  ${t(58, 1165, 'Diện tích ~1 m² là khuyến nghị bố trí kèm ghế và vùng thao tác.', 20, '#e7f9ff')}
  </svg>`;

  fs.writeFileSync(outputSvg, svg, 'utf8');
  await sharp(Buffer.from(svg)).png().toFile(outputPng);
  console.log(outputPng);
}

main().catch(err => { console.error(err); process.exitCode = 1; });
