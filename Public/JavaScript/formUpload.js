const formArray = document.querySelectorAll(".api");
let descriptorarray = ["Id", "Face", "FaceID"];

let axiosPostForm = (index) => {
  let formData = new FormData();
  let imageFile = document.querySelector(`#image${index}`);
  let fileData = imageFile.files[0];
  let text = descriptorarray[index];
  let sendUrl = `http://localhost:3000/api/register/creator/${text}`;
  formData.append("file", fileData);
  axios({
    method: "POST",
    url: sendUrl,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        console.log("Success, firm added");
      } else {
        console.log("Error occurred");
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

let submitBtn = document.querySelector("#submitModel");
let modelName = document.querySelector("#modelName");
let about_You = document.querySelector("#aboutYou");
submitBtn.addEventListener("click", (event) => {
  for (let [index, enteries] of descriptorarray.entries()) {
    axiosPostForm(index);
  }
  about_You = about_You.value || "";
  console.log(about_You);
  modelName = modelName.value;
  axios.post("http://localhost:3000/api/createcreator", {
    name: modelName,
    aboutYou: about_You,
  });
});
