/* ============================================
   R.P WOOD — Shared Components (Navbar, Footer, WhatsApp FAB)
   ============================================ */

const WHATSAPP_NUMBER = '5551991962040';
const WHATSAPP_MSG = encodeURIComponent('Olá! Vi o site da R.P Wood e gostaria de mais informações.');

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/sobre.html', label: 'Sobre Nós' },
  { href: '/colecao.html', label: 'Coleção' },
  { href: '/produtos.html', label: 'Produtos' },
  { href: '/contato.html', label: 'Contato' },
];

function getActivePage() {
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') return '/';
  return path;
}

export function renderNavbar() {
  const active = getActivePage();

  const navLinksHTML = NAV_LINKS.map(link => {
    const isActive = (link.href === active) || (link.href === '/' && active === '/index.html');
    return `<li><a href="${link.href}" class="${isActive ? 'active' : ''}">${link.label}</a></li>`;
  }).join('');

  const nav = document.createElement('nav');
  nav.id = 'navbar';
  nav.className = 'navbar';
  nav.innerHTML = `
    <div class="navbar-container">
      <a href="/" class="navbar-logo">
        <img src="/images/logo.png" alt="R.P Wood Personalizados" class="navbar-logo-img" />
      </a>
      <ul class="navbar-links" id="navbar-links">
        ${navLinksHTML}
      </ul>
      <div class="navbar-actions">
        <a href="/carrinho.html" class="cart-icon" aria-label="Carrinho">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span class="cart-badge" id="cart-badge">0</span>
        </a>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de solicitar um orçamento.')}" class="navbar-cta" target="_blank" rel="noopener">
          Solicitar Orçamento
        </a>
        <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="Abrir menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  `;

  document.body.prepend(nav);
}

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="/images/logo.png" alt="R.P Wood Personalizados" class="footer-logo-img" />
          </div>
          <p class="footer-tagline">Transformamos madeira em histórias.<br />Tecnologia CNC • Acabamento Premium</p>
          <div class="footer-social">
            <a href="https://www.instagram.com/rpwoodpersonalizados" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61590214186519" target="_blank" rel="noopener" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
        <div class="footer-links">
          <h4>Links Rápidos</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/sobre.html">Sobre Nós</a></li>
            <li><a href="/colecao.html">Coleção</a></li>
            <li><a href="/produtos.html">Produtos</a></li>
            <li><a href="/contato.html">Contato</a></li>
          </ul>
        </div>
        <div class="footer-services">
          <h4>Serviços</h4>
          <ul>
            <li>Móveis Personalizados</li>
            <li>Decoração em Madeira</li>
            <li>Brindes Corporativos</li>
            <li>Projetos para Igrejas</li>
            <li>Presentes Exclusivos</li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>Contato</h4>
          <ul>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Rua Lineia Maria Gewerh, 420<br />Bairro Campo Pinheiro — Nova Hartz, RS
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +55 51 99196-2040
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              rafael.plsd@gmail.com
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 R.P Wood Personalizados. Todos os direitos reservados.</p>
        <p class="footer-verse">"Eu sou o caminho, a verdade e a vida." — João 14:6</p>
      </div>
    </div>
  `;

  // Insert before WhatsApp FAB or at end of body
  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    document.body.insertBefore(footer, whatsappFloat);
  } else {
    document.body.appendChild(footer);
  }
}

export function renderWhatsAppFAB() {
  const fab = document.createElement('a');
  fab.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;
  fab.className = 'whatsapp-float';
  fab.target = '_blank';
  fab.rel = 'noopener';
  fab.ariaLabel = 'Falar no WhatsApp';
  fab.id = 'whatsapp-float';
  fab.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  `;
  document.body.appendChild(fab);
}
