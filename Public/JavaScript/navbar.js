// let url = "https://knockouttalent/api/categories.com";

// const createLi = (el) => {
//   if (el.title) {
//     const li = document.createElement("li");
//     const a = document.createElement("a");
//     a.href = `/category/${el.id}`;
//     a.classList = `${a.classList} dropdown-item`;
//     a.innerHTML = el.title;
//     li.append(a);
//     dropDownMenu.append(li);
//   }
// };
// const getFunction = async (url) => {
//   try {
//     const response = await axios.get(url);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// };

// let a = getFunction(url).then((element) => {
//   for (let el of element) {
//     createLi(el);
//   }
// });
