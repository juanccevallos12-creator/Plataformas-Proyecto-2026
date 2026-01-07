// /js/utils.js

export const $ = (s, r=document)=> r.querySelector(s);
export const $$ = (s, r=document)=> [...r.querySelectorAll(s)];

export function showToast(msg){
  let t = document.querySelector(".toast");
  if(!t){
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"), 1500);
}

export function fmtUSD(n){
  return new Intl.NumberFormat('es-EC',{
    style:'currency',
    currency:'USD'
  }).format(n);
}


export async function fetchJSON(url, options = {}) {

  const config = {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errTxt = await res.text();
    throw new Error(`Error ${res.status}: ${errTxt}`);
  }

  return await res.json();
}
