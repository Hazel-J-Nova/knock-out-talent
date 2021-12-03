const linkBankAccount = document.querySelector("#linkBankAccount");

let userInfo = axios.get("http://localhost:3000/api/userInfo").then((resp) => {
  return resp.data;
});

if (linkBankAccount) {
  let userLinkBankAccountLink = axios
    .get(`http://localhost:3000/api/${userInfo._id}"/linkBankAccount`)
    .then((resp) => {
      return resp.data;
    });
  linkdBankAccount.setAttribute("href", userLinkBankAccountLink);
}
