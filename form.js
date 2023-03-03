import {
  getDatabase,
  set,
  push,
  ref,
  get,
  child,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

function setData(data) {
  // Create a new user reference with an auto-generated id
  const db = getDatabase();
  const userList = ref(db, "users");
  const newUserRef = push(userList);
  set(newUserRef, { data });
}
// get all data
function getAllData() {
  const db = getDatabase();
  const dbRef = ref(db, "users");
  onValue(
    dbRef,
    (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        //const childKey = childSnapshot.key;
        generRowTable(childSnapshot.val.data);
      });
    },
    {
      onlyOnce: true,
    }
  );
}
//JavaScript/jQuery để lấy dữ liệu từ form và gửi lên server
$(document).ready(function () {
  var objUser = [
    {
      dateTime: "2023-03-03 09:00:00",
      title: "Meeting with Client",
      description: "Discuss project requirements",
      location: "Hanoi, Vietnam",
      imgUrl: "https://example.com/images/client.png",
    },
    {
      dateTime: "2023-03-04 14:00:00",
      title: "Team Building Event",
      description: "Fun activities and games",
      location: "Ho Chi Minh City, Vietnam",
      imgUrl: "https://example.com/images/team-building.png",
    },
    {
      dateTime: "2023-03-05 10:30:00",
      title: "Product Demo",
      description: "Showcase new product features",
      location: "Singapore",
      imgUrl: "https://example.com/images/product.png",
    },
    {
      dateTime: "2023-03-06 11:00:00",
      title: "Interview",
      description: "Hiring for a new position",
      location: "Sydney, Australia",
      imgUrl: "https://example.com/images/interview.png",
    },
    {
      dateTime: "2023-03-07 15:00:00",
      title: "Webinar",
      description: "Learn about the latest industry trends",
      location: "Online",
      imgUrl: "https://example.com/images/webinar.png",
    },
  ];

  $.each(objUser, function (index, value) {
    generRowTable(value, index);
  });

  $("#submitBtn").click(function (e) {
    e.preventDefault();
    //Lấy giá trị từ các input
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
      alert("Success!");
    };
  });
});
function generRowTable(objUser, id) {
  const row = $("<tr></tr>");
  //Khai báo các tag button
  const btnUpdate = $(
    '<button  type="submit" class="btn btn-primary">Update</button>'
  );
  const btnDelete = $(
    '<button type="submit" class="btn btn-primary">Delete</button>'
  );
  //Khai báo các tag td
  const tdId = $(`<td></td>`);
  const tdDateTime = $("<td></td>");
  const tdTitle = $("<td></td>");
  const tdDescription = $("<td></td>");
  const tdLocation = $("<td></td>");
  const img = $(`<img alt="Lỗi" src=""/>`).css({
    width: "100px",
    height: "50px",
    "object-fit": "cover",
  });
  img.attr("src", "data:image/jpeg;base64," + objUser.imgUrl);
  const tdImg = $("<td></td>").append(img);
  const tdBtnDelete = $("<td></td>").append(btnDelete);
  const tdBtnUpdate = $("<td></td>").append(btnUpdate);
  row.append(tdId.text(id));
  row.append(tdDateTime.text(objUser.dateTime));
  row.append(tdTitle.text(objUser.title));
  row.append(tdDescription.text(objUser.description));
  row.append(tdLocation.text(objUser.location));
  row.append(tdImg);
  row.append(tdBtnUpdate);
  row.append(tdBtnDelete);
  $("#table-body").append(row);

  btnDelete.click(function () {
    row.remove();
  });
}
function loadData() {
  $.ajax({
    url: "/",
    method: "GET",
    dataType: "json",
    data: objUser,
    success: function (response) {
      // xử lý dữ liệu trả về khi yêu cầu thành công
      console.log(response);
    },
    error: function (xhr, status, error) {
      // xử lý khi yêu cầu thất bại
    },
  });
}
