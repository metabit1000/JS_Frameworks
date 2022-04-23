window.addEventListener("load", () => {
    var template = document.getElementById("article-template");
    var clonado = template.cloneNode(true);

    var articles = document.getElementById("articles");
    for (let i = 0; i < 5; ++i) {
      var clonado = template.cloneNode(true);
      clonado.removeAttribute("id");
      var title  = clonado.getElementsByTagName("h2")[0];
      title.innerHTML = title.textContent + ' ' + i;
      articles.appendChild(clonado);
    }
  });