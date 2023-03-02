import {
  getDatabase,
  set,
  push,
  ref,
  get,
  child,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

//JavaScript/jQuery để lấy dữ liệu từ form và gửi lên server
$(document).ready(function () {
  $("#submitBtn").click(function (e) {
    e.preventDefault();
    // Lấy giá trị từ các input
    var dateTime = $("#dateTime").val();
    var title = $("#title").val();
    var description = $("#description").val();
    var location = $("#location").val();
    var imgUrl = $("#imgUrl").get(0);

    //  var input = $("input[type=file]")[0];
    var file = imgUrl.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      var base64Image = reader.result.split(",")[1];
      // Lưu ảnh mã hóa Base64 vào Realtime Database
      const data = {
        dateTime: dateTime,
        title: title,
        description: description,
        location: location,
        imgUrl: base64Image,
      };

      setData(data);
      console.log("Success!", data);
    };
  });
  $("#btnShow").click(function (e) {
    e.preventDefault();
    //  displayBase64Image();
    getAllData();
    console.log("success");
  });
});

function setData(data) {
  // Create a new post reference with an auto-generated id
  const db = getDatabase();
  const userList = ref(db, "users");
  const newUserRef = push(userList);
  set(newUserRef, { data });
}
function displayBase64Image() {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `/users/-NPWhbTHRMO59k-xwCg3`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        var base64Image = snapshot.val().data.imgUrl;
        var image = $("#image");
        var imageUrl = "data:image/jpeg;base64," + base64Image;
        // Hiển thị ảnh
        image.attr("src", imageUrl);

        var img = document.createElement("img");
        img.src = "data:image/png;base64," + base64Image;
        img.height = 100;
        img.width = 200;
        $(".show-img").html(img);
        // document.body.appendChild(img);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
function getAllData() {
  const db = getDatabase();
  const dbRef = ref(db, "users");
  // Get a key for a new Post.
  onValue(
    dbRef,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        var base64Image = childSnapshot.val().data.imgUrl;
        var img = document.createElement("img");
        img.src = "data:image/png;base64," + base64Image;
        img.height = 100;
        img.width = 200;
        $(".show-img").append(img);
        console.log(childKey);
      });
    },
    {
      onlyOnce: true,
    }
  );
}
