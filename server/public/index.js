const list = document.querySelector(".shorts-list");

fetch(
  "https://shorty-db.nehanyaser.repl.co/?document=short-urls&api_key=zIEkkgG3IMPH9dr8"
)
  .then((res) => res.json())
  .then((data) => {
    const shorts = data.reverse();
    shorts.slice(0, 10);

    shorts.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `${index + 1} - <a href="/?id=${item.id}">${item.id}</a>`;

      list.appendChild(li);
    });
  })
  .catch((err) => console.log(err));
