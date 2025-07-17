let allData = [];

async function loadCatalogData() {
  const response = await fetch(`${baseId}/gviz/tq?tqx=out:json`);
  const text = await response.text();
  const json = JSON.parse(text.substring(47, text.length - 2));
  const rows = json.table.rows;

  allData = rows.map(row => {
    const getValue = (i) => row.c[i]?.v || '';
    return {
      категория: getValue(0),
      подкатегория: getValue(1),
      подподкатегория: getValue(2),
      название: getValue(3),
      описание: getValue(4),
      фото: getValue(5),
      цена: getValue(6),
      whatsapp1: getValue(7),
      whatsapp2: getValue(8),
      telegram: getValue(9),
      instagram: getValue(10)
    };
  });

  showCategories();
}

function showCategories() {
  const categories = [...new Set(allData.map(p => p.категория).filter(Boolean))];
  const container = document.getElementById("categoryList");
  container.innerHTML = categories.map(cat =>
    `<button onclick="showSubcategories('${cat}')">${cat}</button>`
  ).join('');
}

function showSubcategories(category) {
  const subcategories = [...new Set(allData
    .filter(p => p.категория === category)
    .map(p => p.подкатегория)
    .filter(Boolean)
  )];

  const container = document.getElementById("subcategoryList");
  container.innerHTML = subcategories.map(sub =>
    `<button onclick="showSubsubcategories('${category}', '${sub}')">${sub}</button>`
  ).join('');
}

function showSubsubcategories(category, subcategory) {
  const subsubcategories = [...new Set(allData
    .filter(p => p.категория === category && p.подкатегория === subcategory)
    .map(p => p.подподкатегория)
    .filter(Boolean)
  )];

  const container = document.getElementById("subsubcategoryList");
  container.innerHTML = subsubcategories.map(sub =>
    `<button onclick="showProducts('${category}', '${subcategory}', '${sub}')">${sub}</button>`
  ).join('');
}

function showProducts(category, subcategory, subsubcategory) {
  const products = allData.filter(p =>
    p.категория === category &&
    p.подкатегория === subcategory &&
    (p.подподкатегория === subsubcategory || !p.подподкатегория)
  );

  renderProductList(products, document.getElementById('productList'));
}

function renderProductList(products, container) {
  if (!container) return;

  container.innerHTML = products.map(p => `
    <div class="product-card">
      ${p.фото ? `<img src="${p.фото}" alt="${p.название}" />` : ''}
      <h3>${p.название || ''}</h3>
      <p>${p.описание || ''}</p>
      <p><strong>${p.цена || ''}</strong></p>
      <div class="buttons">
        ${p.whatsapp1 ? `<a href="https://wa.me/${p.whatsapp1}" target="_blank">WhatsApp 1</a>` : ''}
        ${p.whatsapp2 ? `<a href="https://wa.me/${p.whatsapp2}" target="_blank">WhatsApp 2</a>` : ''}
        ${p.telegram ? `<a href="${p.telegram}" target="_blank">Telegram</a>` : ''}
        ${p.instagram ? `<a href="${p.instagram}" target="_blank">Instagram</a>` : ''}
      </div>
    </div>
  `).join('');
}

// Запускаем при загрузке страницы
loadCatalogData();
