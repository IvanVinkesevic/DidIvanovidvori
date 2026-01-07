console.log("blog.js se učitava - DOM je već spreman!");

const section = document.getElementById("osvrti");
console.log("Section element:", section);

function formatText(text) {
  if (!text) return "";

  // Prvo zamijeni specijalne slučajeve
  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  formatted = formatted
    .replace(/\n\n+/g, '</p><p class="blog-paragraph">') // Dva nova reda = novi paragraf
    .replace(/\n/g, "<br>") // Jedan novi red = break
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **bold**
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // *italic*
    .replace(/^>(.*)$/gm, "<blockquote>$1</blockquote>"); // > za citate

  // Ako nema <p> tagova, dodaj ih
  if (!formatted.includes("<p")) {
    formatted = `<p class="blog-paragraph">${formatted}</p>`;
  }

  return formatted;
}

// Funkcija za prikaz članaka
function displayPosts(posts) {
  if (!section) {
    console.error("Section element nije pronađen!");
    return;
  }

  section.innerHTML = "";

  posts.forEach((osvrt) => {
    const article = document.createElement("article");
    const userReaction = getUserReaction(osvrt.id);

    article.innerHTML = `
      <h2>${osvrt.naslov}</h2>
      <small>${osvrt.datum}</small>
      <div class="blog-text">${formatText(osvrt.tekst)}</div>
      
      <div class="reaction-buttons">
        <button class="like-btn ${userReaction === "like" ? "active" : ""}" 
                onclick="handleLike('${osvrt.id}')"
                ${userReaction ? "disabled" : ""}>
          👍 <span class="like-count">${osvrt.likes || 0}</span>
        </button>
        <button class="dislike-btn ${
          userReaction === "dislike" ? "active" : ""
        }" 
                onclick="handleDislike('${osvrt.id}')"
                ${userReaction ? "disabled" : ""}>
          👎 <span class="dislike-count">${osvrt.dislikes || 0}</span>
        </button>
      </div>
      
      ${
        userReaction
          ? `<div class="reaction-stats">Već ste ${
              userReaction === "like" ? "lajkali" : "dislajkali"
            } ovaj tekst</div>`
          : ""
      }
      
      <hr/>
    `;
    section.appendChild(article);
  });
}

// Učitavanje podataka
async function loadBlogData() {
  try {
    const firebasePosts = await loadBlogPosts();
    const allPosts = await loadAllBlogPosts();

    console.log("🔥 allPosts za arhivu:", allPosts);

    displayPosts(firebasePosts);
    window.allPosts = allPosts;

    console.log("✅ Glavni prikaz:", firebasePosts.length, "postova");
    console.log("✅ Arhiva postavljena:", window.allPosts.length, "postova");
  } catch (error) {
    console.error("Greška:", error);
    section.innerHTML = "<p>Trenutno nema dostupnih tekstova.</p>";
  }
}

function showArchive() {
  console.log("showArchive - allPosts:", window.allPosts);

  const archiveHTML = `
    <div class="archive-modal">
      <button class="close-btn" onclick="closeArchive()">X</button>
      <h3>Pregled osvrta (${window.allPosts ? window.allPosts.length : 0})</h3>
      <div class="archive-list">
        ${
          window.allPosts
            ? window.allPosts
                .map(
                  (post) => `
          <div class="archive-item" onclick="openPost('${post.id}')">
            <h4>${post.naslov}</h4>
            <small>${post.datum}</small>
            <p>${post.tekst.substring(0, 100)}...</p>
          </div>
        `
                )
                .join("")
            : "<p>Nema tekstova za prikaz</p>"
        }
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", archiveHTML);
}

function closeArchive() {
  const modal = document.querySelector(".archive-modal");
  if (modal) modal.remove();
}

// NOVE FUNKCIJE ZA OTVARANJE ČLANAKA
function openPost(postId) {
  console.log("Otvaram post:", postId);

  const post = window.allPosts.find((p) => p.id === postId);

  if (!post) {
    console.error("Post nije pronađen:", postId);
    return;
  }

  const postHTML = `
    <div class="post-modal">
      <button class="close-btn" onclick="closePostModal()">X</button>
      <h2>${post.naslov}</h2>
      <small>${post.datum}</small>
      <div class="post-content">
        ${formatText(post.tekst)}
      </div>
    </div>
    <div class="modal-overlay" onclick="closePostModal()"></div>
  `;

  document.body.insertAdjacentHTML("beforeend", postHTML);
}

function closePostModal() {
  const modal = document.querySelector(".post-modal");
  const overlay = document.querySelector(".modal-overlay");
  if (modal) modal.remove();
  if (overlay) overlay.remove();
}

// Globalne funkcije
window.showArchive = showArchive;
window.closeArchive = closeArchive;
window.openPost = openPost;
window.closePostModal = closePostModal;

// Like/Dislike placeholder funkcije
window.handleLike = function (postId) {
  console.log("Like:", postId);
};

window.handleDislike = function (postId) {
  console.log("Dislike:", postId);
};

// Pokreni odmah
loadBlogData();
