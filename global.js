console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains('home');

const pages = [
    { url: "https://lh-008.github.io/portfolio/", title: "Home" },
    { url: "https://lh-008.github.io/portfolio/projects/index.html", title: "Projects" },
    { url: "https://lh-008.github.io/portfolio/resume/index.html", title: "Resume" },
    { url: "https://lh-008.github.io/portfolio/contact/index.html", title: "Contact" },
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


// try {
//   const form = document.getElementById("contact-form");

//   form.addEventListener("submit", (event) => {
//     event.preventDefault();

//     const data = new FormData(form);
//     let mailtoUrl = "mailto:lhl632891114@gmail.com?";
//     const params = [];

//     for (let [name, value] of data) {
//       params.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
//     }

//     mailtoUrl += params.join("&");
//     console.log("Generated mailto URL:", mailtoUrl);

//     location.href = mailtoUrl;
//   });
// } catch (error) {
//   console.error('Error in form submission handler:', error);
// }

export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();
      return data; 

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}


export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  projects.forEach(project => {
      const article = document.createElement('article');
      article.innerHTML = `
          <h3>${project.title}</h3>
          <img src="${project.image}" alt="${project.title}">
          <p>${project.description}</p>
      `;
      containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}