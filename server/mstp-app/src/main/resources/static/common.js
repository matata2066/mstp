function initSidebar(activeId) {
  const menuItems = [
    { group: '工作台', items: [
      { id: 'dashboard', icon: '📊', label: '总览', href: '/dashboard.html' },
    ]},
    { group: '映射管理', items: [
      { id: 'account-mapping', icon: '🏦', label: '账号映射', href: '/account-mapping.html' },
      { id: 'bank-mapping', icon: '🏢', label: '行号映射', href: '/bank-mapping.html' },
      { id: 'remark-mapping', icon: '💬', label: '附言映射', href: '/remark-mapping.html' },
      { id: 'payer-config', icon: '💳', label: '付款配置', href: '/payer-config.html' },
      { id: 'approval-query', icon: '📋', label: '审批查询', href: '/approval-pending.html', badgeId: 'approval-badge' },
    ]},
    { group: '交易查询', items: [
      { id: 'payment-query', icon: '🔍', label: '支付指令', href: '/payment-query.html' },
      { id: 'maintenance-log', icon: '📝', label: '维护记录', href: '/maintenance-log.html' },
    ]},
  ];

  const sidebar = document.getElementById('sidebar');
  let html = `<div class="sidebar-logo"><div class="logo-icon">M</div>MSTP 支付中间平台</div><div class="sidebar-menu">`;

  menuItems.forEach(group => {
    html += `<div class="menu-group-title">${group.group}</div>`;
    group.items.forEach(item => {
      const isActive = item.id === activeId ? ' active' : '';
      const badge = item.badgeId ? `<span class="menu-badge" id="${item.badgeId}" style="display:none">0</span>` : (item.badge ? `<span class="menu-badge">${item.badge}</span>` : '');
      html += `<a href="${item.href}" class="menu-item${isActive}"><span class="menu-icon">${item.icon}</span>${item.label}${badge}</a>`;
    });
  });

  html += `</div>`;
  sidebar.innerHTML = html;

  fetch('/api/approvals?status=PENDING&size=1')
    .then(function(r) { return r.json(); })
    .then(function(page) {
      var el = document.getElementById('approval-badge');
      if (el && page.totalElements > 0) {
        el.textContent = page.totalElements;
        el.style.display = '';
      }
    })
    .catch(function() {});
}

function initHeader(breadcrumbs) {
  const header = document.getElementById('header');
  let bcHtml = breadcrumbs.map((b, i) => {
    if (i === breadcrumbs.length - 1) return `<span class="current">${b.text}</span>`;
    return `<a href="${b.href}">${b.text}</a><span>/</span>`;
  }).join('');

  header.innerHTML = `
    <div class="header-breadcrumb">${bcHtml}</div>
    <div class="header-right">
      <div class="header-user">
        <div class="header-avatar">A</div>
        <span>admin</span>
      </div>
      <a href="/logout" style="color:#1677ff;font-size:13px;margin-left:12px">退出登录</a>
    </div>`;
}

function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllModals(); });

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('show');
  }
});

function maskAccount(acc) {
  if (!acc || acc.length < 8) return acc;
  return acc.substring(0, 4) + '********' + acc.substring(acc.length - 4);
}

function maskName(name) {
  if (!name || name.length < 1) return name;
  return name.charAt(0) + '*'.repeat(Math.min(name.length - 1, 4));
}

function formatAmount(n) {
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showToast(msg, type) {
  type = type || 'info';
  var colors = { success: '#52c41a', error: '#ff4d4f', info: '#1677ff', warning: '#faad14' };
  var el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:10000;padding:10px 24px;border-radius:6px;color:#fff;font-size:14px;background:' + (colors[type] || colors.info) + ';box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:opacity 0.3s;';
  document.body.appendChild(el);
  setTimeout(function() { el.style.opacity = '0'; setTimeout(function() { el.remove(); }, 300); }, 2000);
}
