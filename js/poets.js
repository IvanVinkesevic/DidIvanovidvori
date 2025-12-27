// Podaci o pjesnicima i njihovim pjesmama
const poetsData = [
  {
    id: "antun-branko-simic",
    name: "Antun Branko Šimić",
    image: "placeholder-4x3.jpg",
    bio: "Hrvatski pjesnik iz Livna, jedan od najistaknutijih predstavnika hrvatske moderne poezije.",
    poems: [
      {
        id: "selo-moje",
        title: "Selo moje",
        content: `Selo moje, ti si moj raj,
Gdje sam sreću pronašao svoj,
U tvojim poljima, u tvojoj tišini,
Srce moje uvijek te želi.`,
      },
      {
        id: "zora-na-selu",
        title: "Zora na selu",
        content: `Zora sviće nad poljima mojim,
Ptice pjevaju u jutarnjem miru,
Rosu pijem s lišća trava zelenih,
U selu mom, gdje je život pravi.`,
      },
    ],
  },
  {
    id: "tin-ujevic",
    name: "Tin Ujević",
    image: "placeholder-4x3.jpg",
    bio: "Jedan od najvećih hrvatskih pjesnika 20. stoljeća, čija poezija obiluje lirskim motivima.",
    poems: [
      {
        id: "seljacka-pjesma",
        title: "Seljačka pjesma",
        content: `Orao visoko nad poljem kruži,
Seljak ore zemlju svoju,
Znoj mu lije niz čelo staro,
Ali srce mu puno je pokoja.`,
      },
      {
        id: "vecer-na-selu",
        title: "Večer na selu",
        content: `Večer pala nad selom tišina,
Samo cvrčci pjevaju u travi,
Dim se vije iz dimnjaka starog,
U selu mom, gdje je život pravi.`,
      },
    ],
  },
  {
    id: "dragutin-tadjjanovic",
    name: "Dragutin Tadijanović",
    image: "placeholder-4x3.jpg",
    bio: "Hrvatski pjesnik čija je poezija duboko vezana uz rodni kraj i seoske teme.",
    poems: [
      {
        id: "rodni-kraj",
        title: "Rodni kraj",
        content: `U mom selu, gdje sam odrastao,
Svaki putić, svako drvo poznajem,
Tu je moj dom, tu je moj život,
U selu mom, gdje sretan ostajem.`,
      },
      {
        id: "zito",
        title: "Žito",
        content: `Zlato žito na poljima mojim,
Vjetar njima lagano se igra,
Seljaci žanje plodove rada,
U selu mom, gdje je sreća prava.`,
      },
    ],
  },
];

// Inicijalizacija stranice
document.addEventListener("DOMContentLoaded", function () {
  const poetsNav = document.getElementById("poets-nav");
  const poetsContainer = document.getElementById("poets-container");
  const backToTopButton = document.getElementById("back-to-top");

  // Generiranje navigacije po pjesnicima
  poetsData.forEach((poet) => {
    const navItem = document.createElement("a");
    navItem.className = "poet-nav-item";
    navItem.textContent = poet.name;
    navItem.href = `#${poet.id}`;
    navItem.dataset.poetId = poet.id;
    poetsNav.appendChild(navItem);
  });

  // Generiranje sekcija pjesnika
  poetsData.forEach((poet) => {
    const poetSection = document.createElement("section");
    poetSection.className = "poet-section";
    poetSection.id = poet.id;

    // Header pjesnika
    const poetHeader = document.createElement("div");
    poetHeader.className = "poet-header";

    const poetImage = document.createElement("img");
    poetImage.className = "poet-image";
    poetImage.src = poet.image;
    poetImage.alt = poet.name;

    const poetInfo = document.createElement("div");
    poetInfo.className = "poet-info";

    const poetName = document.createElement("h2");
    poetName.className = "poet-name";
    poetName.textContent = poet.name;

    const poetBio = document.createElement("p");
    poetBio.className = "poet-bio";
    poetBio.textContent = poet.bio;

    poetInfo.appendChild(poetName);
    poetInfo.appendChild(poetBio);

    poetHeader.appendChild(poetImage);
    poetHeader.appendChild(poetInfo);

    // Navigacija po pjesmama
    const poemsNav = document.createElement("div");
    poemsNav.className = "poems-nav";

    poet.poems.forEach((poem) => {
      const poemNavItem = document.createElement("div");
      poemNavItem.className = "poem-nav-item";
      poemNavItem.textContent = poem.title;
      poemNavItem.dataset.poemId = poem.id;
      poemsNav.appendChild(poemNavItem);
    });

    // Prikaz pjesme
    const poemContent = document.createElement("div");
    poemContent.className = "poem-content";

    // Ako postoje pjesme, prikaži prvu
    if (poet.poems.length > 0) {
      poemContent.textContent = poet.poems[0].content;
      poemsNav.children[0].classList.add("active");
    }

    poetSection.appendChild(poetHeader);
    poetSection.appendChild(poemsNav);
    poetSection.appendChild(poemContent);

    poetsContainer.appendChild(poetSection);
  });

  // Postavljanje aktivne sekcije pjesnika na osnovu hash-a
  function setActivePoetFromHash() {
    const hash = window.location.hash.substring(1);
    const poetSections = document.querySelectorAll(".poet-section");
    const poetNavItems = document.querySelectorAll(".poet-nav-item");

    // Sakrij sve sekcije
    poetSections.forEach((section) => {
      section.classList.remove("active");
    });

    // Ukloni aktivnu klasu sa svih navigacijskih stavki
    poetNavItems.forEach((item) => {
      item.classList.remove("active");
    });

    // Ako postoji hash i odgovarajući pjesnik, prikaži ga
    if (hash) {
      const targetSection = document.getElementById(hash);
      const targetNavItem = document.querySelector(
        `.poet-nav-item[data-poet-id="${hash}"]`
      );

      if (targetSection && targetNavItem) {
        targetSection.classList.add("active");
        targetNavItem.classList.add("active");

        // Pomakni se do sekcije
        setTimeout(() => {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      // Ako nema hash-a, prikaži prvog pjesnika
      if (poetSections.length > 0) {
        poetSections[0].classList.add("active");
        poetNavItems[0].classList.add("active");
      }
    }
  }

  // Postavi aktivnog pjesnika na početku
  setActivePoetFromHash();

  // Osluškuj promjene hash-a
  window.addEventListener("hashchange", setActivePoetFromHash);

  // Navigacija po pjesmama
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("poem-nav-item")) {
      const poemNavItem = e.target;
      const poemId = poemNavItem.dataset.poemId;
      const poetSection = poemNavItem.closest(".poet-section");
      const poemContent = poetSection.querySelector(".poem-content");

      // Pronađi pjesmu
      const poetId = poetSection.id;
      const poet = poetsData.find((p) => p.id === poetId);
      const poem = poet.poems.find((p) => p.id === poemId);

      if (poem) {
        // Ukloni aktivnu klasu sa svih pjesama
        const allPoemNavItems = poetSection.querySelectorAll(".poem-nav-item");
        allPoemNavItems.forEach((item) => {
          item.classList.remove("active");
        });

        // Postavi aktivnu pjesmu
        poemNavItem.classList.add("active");
        poemContent.textContent = poem.content;
      }
    }
  });

  // Povratak na vrh
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  backToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
