import api from '../services/api.js';

/**
 * Generates a beautifully formatted ritual menu document
 * @param {Array} services - Array of service objects from the API
 * @returns {string} - Formatted menu content
 */
export function generateRitualMenuText(services = []) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Group services by category
  const servicesByCategory = {};
  services.forEach(service => {
    const category = service.serviceCategory || service.category || 'Wellness';
    if (!servicesByCategory[category]) {
      servicesByCategory[category] = [];
    }
    servicesByCategory[category].push(service);
  });

  // Format price
  const formatPrice = (price, currency = 'USD') => {
    if (typeof price === 'number') {
      const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
      return `${symbol}${price.toFixed(0)}`;
    }
    return price || 'Price on request';
  };

  // Format duration
  const formatDuration = (duration) => {
    if (!duration) return '';
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (minutes === 0) return `${hours} hr`;
    return `${hours} hr ${minutes} min`;
  };

  let menu = '';

  // Header
  menu += '╔═══════════════════════════════════════════════════════════════╗\n';
  menu += '║                                                               ║\n';
  menu += '║           TANA\'S BEAUTY BOOST SPA                            ║\n';
  menu += '║                                                               ║\n';
  menu += '║              RITUAL MENU & TREATMENT GUIDE                    ║\n';
  menu += '║                                                               ║\n';
  menu += '╚═══════════════════════════════════════════════════════════════╝\n\n';

  // Introduction
  menu += 'Welcome to Tana\'s Beauty Boost Spa, where coastal luxury meets\n';
  menu += 'therapeutic excellence. Our curated rituals are designed to\n';
  menu += 'restore, rejuvenate, and inspire your wellness journey.\n\n';

  menu += '═══════════════════════════════════════════════════════════════\n';
  menu += '                    SIGNATURE TREATMENTS\n';
  menu += '═══════════════════════════════════════════════════════════════\n\n';

  // Services by category
  const categoryOrder = ['Massage', 'Facial', 'Body Treatment', 'Wellness', 'Spa Package'];
  const otherCategories = Object.keys(servicesByCategory).filter(
    cat => !categoryOrder.includes(cat)
  );
  const orderedCategories = [...categoryOrder, ...otherCategories];

  orderedCategories.forEach(category => {
    const categoryServices = servicesByCategory[category];
    if (!categoryServices || categoryServices.length === 0) return;

    menu += `\n${category.toUpperCase()}\n`;
    menu += '─'.repeat(60) + '\n\n';

    categoryServices.forEach((service, index) => {
      const name = service.name || 'Treatment';
      const duration = formatDuration(service.duration || service.durationMinutes);
      const price = formatPrice(service.basePrice || service.price, service.currency);
      const description = service.description || service.headline || '';

      menu += `${index + 1}. ${name.toUpperCase()}\n`;
      if (duration) {
        menu += `   Duration: ${duration}`;
      }
      if (price) {
        menu += duration ? `  |  Price: ${price}` : `   Price: ${price}`;
      }
      menu += '\n';
      
      if (description) {
        const wrappedDescription = description.length > 55
          ? description.match(/.{1,55}(\s|$)/g)?.join('\n   ') || description
          : description;
        menu += `   ${wrappedDescription}\n`;
      }

      // Badges
      if (service.badges && service.badges.length > 0) {
        menu += `   ${service.badges.join(' • ')}\n`;
      }

      menu += '\n';
    });
  });

  // Add-ons section
  menu += '\n═══════════════════════════════════════════════════════════════\n';
  menu += '                    ADD-ON ENHANCEMENTS\n';
  menu += '═══════════════════════════════════════════════════════════════\n\n';
  menu += '✨ Hot Stone Therapy                    +$25\n';
  menu += '✨ Aromatherapy Upgrade                 +$15\n';
  menu += '✨ Scalp Treatment                      +$20\n';
  menu += '✨ Hand & Foot Care                     +$30\n';
  menu += '✨ Extended Duration (30 min)          +$40\n';
  menu += '✨ Couples Treatment                    +$50\n\n';

  // Booking Information
  menu += '═══════════════════════════════════════════════════════════════\n';
  menu += '                    BOOKING INFORMATION\n';
  menu += '═══════════════════════════════════════════════════════════════\n\n';
  menu += '📞 Phone:        +27 788637252\n';
  menu += '📱 WhatsApp:     +27 788637252\n';
  menu += '📧 Email:        Tana\'sbeautyboost@gmail.com\n';
  menu += '🌐 Website:      www.blueocean.co\n\n';
  menu += 'Our spa concierge is available to customize treatment packages\n';
  menu += 'tailored to your wellness needs. We recommend booking in advance\n';
  menu += 'to secure your preferred time slot.\n\n';

  // Policies
  menu += '═══════════════════════════════════════════════════════════════\n';
  menu += '                    POLICIES & INFORMATION\n';
  menu += '═══════════════════════════════════════════════════════════════\n\n';
  menu += '• Cancellation: 24-hour notice required for cancellations\n';
  menu += '• Late Arrival: May result in shortened treatment time\n';
  menu += '• Gratuity: Not included, at your discretion\n';
  menu += '• Payment: We accept cash, card, and mobile payments\n';
  menu += '• Gift Cards: Available for purchase\n\n';

  // Footer
  menu += '═══════════════════════════════════════════════════════════════\n';
  menu += `Generated: ${formattedDate}\n`;
  menu += 'Tana\'s Beauty Boost Spa - Blue Ocean Capsule\n';
  menu += 'Coastal Luxury • Therapeutic Excellence\n';
  menu += '═══════════════════════════════════════════════════════════════\n';

  return menu;
}

/**
 * Generates an HTML version of the ritual menu for better formatting
 * @param {Array} services - Array of service objects from the API
 * @returns {string} - HTML content
 */
export function generateRitualMenuHTML(services = []) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Group services by category
  const servicesByCategory = {};
  services.forEach(service => {
    const category = service.serviceCategory || service.category || 'Wellness';
    if (!servicesByCategory[category]) {
      servicesByCategory[category] = [];
    }
    servicesByCategory[category].push(service);
  });

  const formatPrice = (price, currency = 'USD') => {
    if (typeof price === 'number') {
      const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
      return `${symbol}${price.toFixed(0)}`;
    }
    return price || 'Price on request';
  };

  const formatDuration = (duration) => {
    if (!duration) return '';
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (minutes === 0) return `${hours} hr`;
    return `${hours} hr ${minutes} min`;
  };

  const categoryOrder = ['Massage', 'Facial', 'Body Treatment', 'Wellness', 'Spa Package'];
  const otherCategories = Object.keys(servicesByCategory).filter(
    cat => !categoryOrder.includes(cat)
  );
  const orderedCategories = [...categoryOrder, ...otherCategories];

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tana's Beauty Boost Spa - Ritual Menu</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: linear-gradient(135deg, #0b233e 0%, #1a4a6e 100%);
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 60px 50px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      border-radius: 12px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #1da0e6;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .header h1 {
      font-size: 36px;
      color: #0b233e;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header .subtitle {
      font-size: 18px;
      color: #666;
      font-weight: 300;
      letter-spacing: 2px;
    }
    .intro {
      text-align: center;
      color: #555;
      margin-bottom: 40px;
      font-size: 16px;
      line-height: 1.8;
    }
    .section {
      margin-bottom: 50px;
    }
    .section-title {
      font-size: 24px;
      color: #0b233e;
      border-bottom: 2px solid #1da0e6;
      padding-bottom: 10px;
      margin-bottom: 25px;
      font-weight: 600;
    }
    .service {
      margin-bottom: 30px;
      padding-bottom: 25px;
      border-bottom: 1px solid #e0e0e0;
    }
    .service:last-child {
      border-bottom: none;
    }
    .service-name {
      font-size: 20px;
      color: #0b233e;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .service-meta {
      color: #666;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .service-description {
      color: #555;
      font-size: 15px;
      line-height: 1.7;
      margin-top: 8px;
    }
    .badges {
      margin-top: 10px;
    }
    .badge {
      display: inline-block;
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      margin-right: 8px;
      margin-top: 5px;
    }
    .addons {
      background: #f5f5f5;
      padding: 25px;
      border-radius: 8px;
      margin-top: 30px;
    }
    .addon-item {
      padding: 8px 0;
      color: #555;
      font-size: 15px;
    }
    .contact-info {
      background: linear-gradient(135deg, #0b233e 0%, #1a4a6e 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-top: 40px;
    }
    .contact-info h3 {
      margin-bottom: 20px;
      font-size: 20px;
    }
    .contact-item {
      margin-bottom: 12px;
      font-size: 15px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px solid #e0e0e0;
      color: #888;
      font-size: 13px;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>TANA'S BEAUTY BOOST SPA</h1>
      <div class="subtitle">RITUAL MENU & TREATMENT GUIDE</div>
    </div>

    <div class="intro">
      Welcome to Tana's Beauty Boost Spa, where coastal luxury meets therapeutic excellence. 
      Our curated rituals are designed to restore, rejuvenate, and inspire your wellness journey.
    </div>`;

  // Helper function to escape HTML (for string generation)
  const escapeHtml = (text) => {
    if (!text) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, (m) => map[m]);
  };

  // Services by category
  orderedCategories.forEach(category => {
    const categoryServices = servicesByCategory[category];
    if (!categoryServices || categoryServices.length === 0) return;

    html += `
    <div class="section">
      <h2 class="section-title">${escapeHtml(category)}</h2>`;

    categoryServices.forEach((service, index) => {
      const name = service.name || 'Treatment';
      const duration = formatDuration(service.duration || service.durationMinutes);
      const price = formatPrice(service.basePrice || service.price, service.currency);
      const description = service.description || service.headline || '';

      html += `
      <div class="service">
        <div class="service-name">${index + 1}. ${escapeHtml(name)}</div>
        <div class="service-meta">
          ${duration ? `<strong>Duration:</strong> ${escapeHtml(duration)}` : ''}
          ${duration && price ? ' • ' : ''}
          ${price ? `<strong>Price:</strong> ${escapeHtml(price)}` : ''}
        </div>`;

      if (description) {
        html += `<div class="service-description">${escapeHtml(description)}</div>`;
      }

      if (service.badges && service.badges.length > 0) {
        html += `<div class="badges">`;
        service.badges.forEach(badge => {
          html += `<span class="badge">${escapeHtml(badge)}</span>`;
        });
        html += `</div>`;
      }

      html += `</div>`;
    });

    html += `</div>`;
  });

  // Add-ons
  html += `
    <div class="section">
      <h2 class="section-title">Add-On Enhancements</h2>
      <div class="addons">
        <div class="addon-item">✨ Hot Stone Therapy ........................ +$25</div>
        <div class="addon-item">✨ Aromatherapy Upgrade ................... +$15</div>
        <div class="addon-item">✨ Scalp Treatment ......................... +$20</div>
        <div class="addon-item">✨ Hand & Foot Care ........................ +$30</div>
        <div class="addon-item">✨ Extended Duration (30 min) ........... +$40</div>
        <div class="addon-item">✨ Couples Treatment ....................... +$50</div>
      </div>
    </div>`;

  // Contact Info
  html += `
    <div class="contact-info">
      <h3>Booking Information</h3>
      <div class="contact-item">📞 Phone: +27 788637252</div>
      <div class="contact-item">📱 WhatsApp: +27 788637252</div>
      <div class="contact-item">📧 Email: Tana'sbeautyboost@gmail.com</div>
      <div class="contact-item">🌐 Website: www.blueocean.co</div>
      <p style="margin-top: 20px; font-size: 14px; line-height: 1.6;">
        Our spa concierge is available to customize treatment packages tailored to your wellness needs. 
        We recommend booking in advance to secure your preferred time slot.
      </p>
    </div>

    <div class="footer">
      <p><strong>Generated:</strong> ${formattedDate}</p>
      <p>Tana's Beauty Boost Spa - Blue Ocean Capsule</p>
      <p>Coastal Luxury • Therapeutic Excellence</p>
    </div>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Escapes HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Fetches services and generates a downloadable ritual menu
 * @param {Function} onComplete - Callback when download is complete
 * @param {Function} onError - Callback when an error occurs
 */
export async function downloadRitualMenu(onComplete, onError) {
  try {
    // Fetch services from API
    const response = await api.services.getServices();
    const services = response.success ? (response.data?.services || []) : [];

    // Generate menu content
    const htmlMenu = generateRitualMenuHTML(services);

    // Create downloadable file
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Download HTML version (beautifully formatted)
    const htmlBlob = new Blob([htmlMenu], { type: 'text/html;charset=utf-8' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = `Tana's-Ritual-Menu-${timestamp}.html`;
    htmlLink.style.display = 'none';
    document.body.appendChild(htmlLink);
    htmlLink.click();
    
    // Clean up after a short delay
    setTimeout(() => {
      document.body.removeChild(htmlLink);
      URL.revokeObjectURL(htmlUrl);
      if (onComplete) onComplete();
    }, 100);

  } catch (error) {
    console.error('Error generating ritual menu:', error);
    
    if (onError) {
      onError(error);
    }
    
    // Fallback to basic menu if API fails
    try {
      const fallbackMenu = generateRitualMenuText([]);
      const blob = new Blob([fallbackMenu], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Tana's-Ritual-Menu-${new Date().toISOString().split('T')[0]}.txt`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (onComplete) onComplete();
      }, 100);
    } catch (fallbackError) {
      console.error('Error with fallback menu:', fallbackError);
      if (onComplete) onComplete();
    }
  }
}

