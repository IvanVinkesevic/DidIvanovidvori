console.log("Inicijaliziram Firebase za blog...");

const firebaseConfig = {
  projectId: "studio-4123987260-2ceeb",
  appId: "1:1032474933263:web:1b57df0d47ae28debe0b7a",
  apiKey: "AIzaSyC30FdtehvYgcwyo9pNw3sLU7GPLHyP7l0",
  authDomain: "studio-4123987260-2ceeb.firebaseapp.com",
};

// Inicijaliziraj Firebase samo ako već nije
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // koristi postojeću inicijalizaciju
}

const db = firebase.firestore();
console.log("Firebase blog inicijaliziran!");

// Funkcija za učitavanje 2 najnovija posta

async function loadBlogPosts() {
  try {
    console.log("Učitavam blog postove...");

    const snapshot = await db
      .collection("blog_posts")
      .orderBy("datum", "desc")
      .limit(2)
      .get();

    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    console.log("Pronađeno postova:", posts.length);
    return posts;
  } catch (error) {
    console.error("Greška pri učitavanju postova:", error);
    return [];
  }
}

// Funkcija za učitavanje SVIH postova

async function loadAllBlogPosts() {
  try {
    const snapshot = await db
      .collection("blog_posts")
      .orderBy("datum", "desc")
      .get();

    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return posts;
  } catch (error) {
    console.error("Greška pri učitavanju arhive:", error);
    return [];
  }
}

// Like/dislike funkcije

function getUserId() {
  let userId = localStorage.getItem("blog_user_id");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("blog_user_id", userId);
  }
  return userId;
}

function getUserReaction(postId) {
  const reactions = JSON.parse(localStorage.getItem("blog_reactions") || "{}");
  return reactions[postId] || null;
}

function saveUserReaction(postId, reaction) {
  const reactions = JSON.parse(localStorage.getItem("blog_reactions") || "{}");
  reactions[postId] = reaction;
  localStorage.setItem("blog_reactions", JSON.stringify(reactions));
}

async function handleLike(postId) {
  try {
    const userId = getUserId();
    const postRef = db.collection("blog_posts").doc(postId);

    await postRef.update({
      likes: firebase.firestore.FieldValue.increment(1),
      likedBy: firebase.firestore.FieldValue.arrayUnion(userId),
    });

    saveUserReaction(postId, "like");
    console.log("Like dodan!");
    loadBlogData();
  } catch (error) {
    console.error("Greška pri like:", error);
  }
}

async function handleDislike(postId) {
  try {
    const userId = getUserId();
    const postRef = db.collection("blog_posts").doc(postId);

    await postRef.update({
      dislikes: firebase.firestore.FieldValue.increment(1),
      dislikedBy: firebase.firestore.FieldValue.arrayUnion(userId),
    });

    saveUserReaction(postId, "dislike");
    console.log("Dislike dodan!");
    loadBlogData();
  } catch (error) {
    console.error("Greška pri dislike:", error);
  }
}
