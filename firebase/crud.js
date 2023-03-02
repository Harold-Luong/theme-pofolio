import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";
import {
  getDatabase,
  child,
  set,
  push,
  ref,
  get,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

//ghi đè data
function writeUserData(name, email, imageUrl) {
  const db = getDatabase();
  set(ref(db, "users/" + 1), {
    username: name,
    email: email,
    profile_picture: imageUrl,
  });
}
// đọc data
function readUserData(id) {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/` + id))
    .then((snapshot) => {
      if (snapshot.exists()) {
        var base64Image = snapshot.val().profile_picture;
        var image = $("#image");
        var imageUrl = "data:image/jpeg;base64," + base64Image;

        // Hiển thị ảnh
        image.attr("src", imageUrl);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
//ghi data với iD tự sinh
function setData() {
  // Create a new post reference with an auto-generated id
  const db = getDatabase();
  const userList = ref(db, "users");
  const newUserRef = push(userList);
  set(newUserRef, {
    dateTime: "2023-03-02T14:30:00Z",
    title: "Tiêu đề",
    description: "Mô tả ngắn",
    location: "Vietnam",
    imgUrl: "http://example.com/image.jpg",
  });
}
//get all data
function getAllData() {
  const db = getDatabase();
  const dbRef = ref(db, "users");
  // Get a key for a new Post.
  onValue(
    dbRef,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        console.log(childKey, childData);
      });
    },
    {
      onlyOnce: true,
    }
  );
}

//on ready DOM
$(function () {
  //btn test click
  $("#btnTest").on("click", function () {
    setData();
  });
  // Lấy đối tượng input chứa ảnh
  var input = $("input[type=file]")[0];
  // Khi người dùng chọn file ảnh
  $(input).on("change", function () {
    // Đọc file ảnh đã chọn và mã hóa thành Base64
    var file = input.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      var base64Image = reader.result.split(",")[1];

      console.log(base64Image);
      //
      // Lưu ảnh mã hóa Base64 vào Realtime Database
    };
  });

  $("#uploadButton").on("click", function () {
    // readUserData("-NPVYzjAD7mJrIJc3zeF");
    input.click();
  });
});
