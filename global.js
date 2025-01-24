console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains('home');

const pages = [
    { url: "",           title: "Home" },
    { url: "https://lh-008.github.io/portfolio/projects/index.html",  title: "Projects" },
    { url: "https://lh-008.github.io/portfolio/resume/index.html",    title: "Resume" },
    { url: "https://lh-008.github.io/portfolio/contact/index.html",   title: "Contact" },
    { url: "https://github.com/lh-008", title: "GitHub" }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host !== location.host) {
        a.target = '_blank';
    }
    nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

const select = document.querySelector('.color-scheme select');
const savedScheme = localStorage.getItem('colorScheme');

if (savedScheme) {
    document.documentElement.style.setProperty('color-scheme', savedScheme);
    select.value = savedScheme;
  }

select.addEventListener('input', function (event) {
    const theme = event.target.value;
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.setItem('colorScheme', theme);
});
