const timeout = 3000,
  supperChangeCount = 3;

let audio = new Audio();

// language
let lang = new URLSearchParams(window.location.search).get("lang") ?? "en",
  language = languages[lang] ?? languages["en"];

// screen size
let area = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// reset screen size on window resize
window.onresize = () => {
  area = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // remake elements
  make();
};

function make() {
  const root = document.getElementById("root");

  root.innerHTML = "";

  const content = () => {
    const h1 = document.createElement("h1");
    h1.innerText = language.question;
    root.appendChild(h1);
    document.title = language.question;
  };

  const yes = () => {
    const button = document.createElement("button");
    button.innerText = language.yes;
    button.style.top = "60vh";
    button.style.left = area.width / 2 - 100 + "px";
    // set question to answer and reset it after a timeout
    button.onclick = () => {
      const h1 = document.querySelector("div#root h1");
      h1.innerText = language.answer;
      setTimeout(() => {
        make();
      }, timeout);
    };
    root.appendChild(button);
  };

  const no = () => {
    let counter = 0;

    const button = document.createElement("button");
    button.innerText = language.no;
    button.style.top = "60vh";
    button.style.left = area.width / 2 + 20 + "px";

    const justChange = () => {
      const position = random();

      button.style.top = position.y + "px";
      button.style.left = position.x + "px";
    };

    const supperChange = () => {
      let supperChangeCounted = 0;

      const changeCallback = () => {
        setTimeout(() => {
          if (supperChangeCounted <= supperChangeCount) {
            supperChangeCounted++;
            justChange();
            changeCallback();
          }
        }, 100 * supperChangeCounted);
      };

      changeCallback();
    };

    const change = () => {
      justChange();

      counter++;
      if (counter % 10 == 0) supperChange();
    };

    button.onclick = change;
    button.onmouseover = change;

    root.appendChild(button);
  };

  // creating elements
  content();
  yes();
  no();
}

const random = () => {
  const calc = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const margin = {
    x: area.width / 5,
    y: area.height / 5,
  };

  return {
    x: calc(margin.x, area.width - margin.x),
    y: calc(margin.y, area.height - margin.y),
  };
};

const speek = () => {
  const select = document.createElement("select");

  select.onchange = () => {
    lang = select.value;
    language = languages[lang];
    window.history.pushState(undefined, undefined, `?lang=${lang}`);
    make();
  };

  for (const key of Object.keys(languages)) {
    const option = document.createElement("option");
    option.innerText = languages[key].name;
    option.value = key;
    select.appendChild(option);
  }

  select.value = lang;
  document.body.appendChild(select);
};

window.onload = () => {
  speek();
  make();
};
