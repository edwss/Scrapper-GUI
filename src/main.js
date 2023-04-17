const { invoke } = window.__TAURI__.tauri;

let searchInputEl;
let homeItemsEl;
async function search() {
  let response =  await invoke("search", { name: searchInputEl.value });
  homeItemsEl.innerHTML = "";
  response['items'].forEach(function(item, i) {
    homeItemsEl.innerHTML += create_item(item);
  })
  
  let items = document
    .querySelectorAll("#item");

  items.forEach(function(item, i){
    item.addEventListener("click", () => seasons(item));
  })
}

async function getHomeItems() {
  let response = await invoke("request_items");
  response['items'].forEach(function(item, i){
    homeItemsEl.innerHTML += create_item(item);
  })
  console.log(response);
  
  let items = document
    .querySelectorAll("#item");
  
  items.forEach(function(item, i){
    item.addEventListener("click", () => seasons(item));
  })
}

async function seasons(item){
  let response = await invoke("seasons", {"name": item.querySelector("#search-title").textContent});
  homeItemsEl.innerHTML = "";
  response['items'].forEach(function(item, i) {
    homeItemsEl.innerHTML += create_season_item(item);
  })
  
  let items = document
    .querySelectorAll("#item");

  items.forEach(function(item, i){
    item.addEventListener("click", () => episodes(item));
  })
  console.log(response);
}

async function episodes(item) {
  console.log(item.querySelector("#search-title").textContent)
  let response = await invoke("episodes", {"name": item.querySelector("#search-title").textContent})
  homeItemsEl.innerHTML = "";
  response['items'].forEach(function(item, i) {
    homeItemsEl.innerHTML += create_item(item)
  })
  
  let items = document
    .querySelectorAll("#item");
  
  items.forEach(function(item, i){
    item.addEventListener("click", () => stream(item));
  })
}

async function stream(item) {
  let response = await invoke("stream", {"name": item.querySelector("#search-title").textContent});
  homeItemsEl.innerHTML = '<video src=' + response['items'][0]['search_name'] + '/>';
  console.log(response)
}

function create_item(item) {  
  return `
    <div class="item-style" id="item"">
      <img alt="" src=` + item["image"] + ` class="item-img-style">
      <p>` + item["name"] + `</p>
      <p style="display:none" id="search-title">` + item['search_name'] + `</p>                                     
    </div>
  `;
}

function create_season_item(item) {  
  return `
    <div class="item-style" id="item"">
      <p>` + item["name"] + `</p>
      <p style="display:none" id="search-title">` + item['search_name'] + `</p>                                     
    </div>
  `;
}

window.addEventListener("DOMContentLoaded", () => {
  homeItemsEl = document.querySelector(".items");
  getHomeItems().then();
  
  searchInputEl = document.querySelector("#seach-input");
  document
    .querySelector("#search-button")
    .addEventListener("click", () => search());
});
