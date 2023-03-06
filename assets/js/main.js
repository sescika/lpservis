//#region general
var url = window.location.pathname;
url = url.substring(url.lastIndexOf('/'));

window.onload = function (){
    brProizvodaUkorpi();
    if(url == "/" || url == "/index.html") {
        ajaxCallback('proizvodi.json', function(result) {  

            ispisDijagnostika();
            ispisSlider(result);
            ispisPodrska();
        })
    }
    if(url == "/products.html") {
        ajaxCallback('sort-opcije.json', function(result) {
            ispisDDl(result, "ddlSort", "ddlSortDiv", 'sort');
        });
        ajaxCallback('proizvodi.json', function(result) {
            ispisProizvoda(result);
            lsSet('proizvodi', result);
        });
        ajaxCallback('proizvodjaci.json', function(result) {
            ispisGrupeFilterCheckboxova(result, "Proizvođači:", "filterProizvodjaci", "input-proizvodjaci");
            lsSet('proizvodjaci', result);
        });
            ajaxCallback('proizvodjaci-procesori.json', function(result) {
            ispisGrupeFilterCheckboxova(result, "Procesor:", "filterProcesori", "input-procesori")
            lsSet('proizvodjaciProcesora', result);
        });
        ajaxCallback('proizvodjaci-graficke.json', function(result) {
            ispisGrupeFilterCheckboxova(result, "Grafička kartica:", "filterGraficke", "input-graficke");
            lsSet('proizvodjaciGraficke', result);
        });
    
        $(document).on('change', '#ddlSort', onPromena);
        $(document).on('change', '#tbSearch', onPromena);
        $(document).on('change', '.form-check-input', onPromena);
        $(document).on('click', '#btnSearch', onPromena);
        $(document).on('click', '#btnClearSearch', clearTb  );
    }
    if(url == "/contact.html") {
        ispisKontakt(); 
        ajaxCallback('dostupni-gradovi.json', function(result) {
            ispisDDl(result, "ddlGradovi", "ddlGradoviDiv", 'gradovi');
        });
        ajaxCallback('proizvodjaci.json', function(result) {
            ispisDDl(result, "ddlProizvodjaci", "ddlProizvodjaciDiv", 'proizvodjaci');
        });

        let btnSubmitForma = document.getElementById("btnFormaSubmit");
        btnSubmitForma.addEventListener("click", proveraForme); 

    }
    if(url == "/cart.html") {
        ispisKorpe();

        $(document).on('click', ".btnSmanji", smanji);
        $(document).on('click', ".btnPovecaj", povecaj);
        $(document).on('click', "#btnOsveziKorpu", osveziKorpu);
    }
}

function ajaxCallback(fajl, result){
    $.ajax({
      url: 'assets/data/' + fajl,
      method: "get",
      dataType: "json",
      success: result,
      error: function(jqXHR, exception){
        var msg = '';
        if (jqXHR.status === 0) {
        msg = 'Not connected.\n Verify Network.';
        } else if (jqXHR.status == 404) {
        msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
        msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
        msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
        msg = 'Time out error.';
        } else if (exception === 'abort') {
        msg = 'Ajax request aborted.';
        } else {
        msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }
        alert(msg);
    }
    })
} 

//#region ispis navigacije 
const navNizHref = ['index.html', 'products.html', 'contact.html', 'author.html'];
const navNizTitle = ['Početna', 'Proizvodi', 'Pošaljite tiket', 'Autor'];

const footerKlaseIkonice = ['fa-solid fa-sitemap', 'fa-regular fa-file','fa-brands fa-instagram', 'fa-regular fa-user'];
const footerTitles = ['Sitemap', 'Dokumentacija', 'Instagram', 'Portfolio'];
const footerHref = ['sitemap.xml', 'documentation.pdf', 'https://www.instagram.com', 'https://sescika.github.io/portfolio/']

let nav = document.getElementById("navbarNav");
let navfooter = document.getElementById("footerNavbar");
let navFooterIcons = document.getElementById("footerLinks");


function prikazNav(navArrHref, navArrTitle, elementToAdd, gde) {
    let html = "";

    html += "<ul class='navbar-nav ms-auto'>";

    if(gde === "nav" ) {
        for(let item in navArrHref) {
            html +=`<li class="nav-item ms-4">  
                        <a class="nav-link" href="${navArrHref[item]}">${navArrTitle[item]}</a>
                    </li>`;
            }
        
        html += `   <a href='cart.html' class='btn border text-light ms-0 ms-lg-3'>
                        <i class='fa-solid fa-cart-shopping'></i>
                        <span id='cartItemsCounter'></span>
                    </a>
                </ul>`     
    }
    if (gde === "footer") {
        for(let item in navArrHref) {
            html +=`<li class="nav-item ms-4">
                        <a class="nav-link" href="${navArrHref[item]}">${navArrTitle[item]}</a>
                    </li>`;
        }
        html += "</ul>"
    }

    elementToAdd.innerHTML = html;
}
function prikazIkonice(ikoniceKlase, ikoniceTitle, navArrHref, elementToAdd) {
    let html = "";

    html += "<ul class='navbar-nav'>";

    for(let item in ikoniceKlase) {
        html +=`<li class="nav-item">
                    <a class="nav-link" href="${navArrHref[item]}" target="_blank"><i class='${ikoniceKlase[item]}'></i> ${ikoniceTitle[item]}</a>
                </li>`;
    }

    html += "</ul>"

    elementToAdd.innerHTML = html;
}
prikazNav(navNizHref, navNizTitle, nav, "nav");
prikazNav(navNizHref, navNizTitle, navfooter, "footer");
prikazIkonice(footerKlaseIkonice, footerTitles, footerHref, navFooterIcons);
//#endregion

//#endregion

//#region index   

function ispisDijagnostika() {
    let html = `<div class="row">
                    <div class="col-12 col-lg-6">
                        <img src="assets/img/index-serviser.jpg" alt="laptop serviser" class="img-fluid" />
                    </div>
                    <div class="col-12 col-lg-6">
                        <h3>Besplatna dijagnostika kvara</h3>
                        <hr />
                        <p>Dijagnostika kvara za sve modele laptopova je Besplatna.</p>
                        <p>Dijagnostika traje 1 radni sat od kada donesete vaš laptop kod nas.</p>
                        <p>Dijagnostiku rade visokokvalifikovani laptop tehničari sa velikim iskustom u popravci laptop uredjaja i propratne opreme.</p>
                        <p>Naša dijagnostika je temeljna i precizna, dijagnostika se radi sa najsavremenijim dijagnostičkim alatima za popravku laptopova kao i najsavremenijim elektronskim.</p>
                    </div>
                </div>`;

    document.getElementById("tehnicar").innerHTML = html;
}

function ispisPodrska() {
    let html = `<div class="row">
                    <div class="col-12 col-lg-6 mb-3">
                        <h3>Besplatna tehnička podrška</h3>
                        <hr>
                        <p>Od početka ove godine smo unapredili tehničku podršku za sve laptop uredjaje 24 časa. Ukoliko imate bilo kakvih pitanja u vezi vašeg laptopa Apple HP Asus Acer Lenovo ili nekog drugog proizvođača pozovite naše laptop tehničare za pomoć.</p>
                        <p>Naši tehničari rešavaju sve softverske i hardverske probleme:</p>
                        <ul>
                            <li>Ne možete da se povežet na internet.</li>
                            <li>Laptop se pali ali nema sliku na ekranu.</li>
                            <li>Na laptopu nema zvuka.</li>
                            <li>Laptop se pali ali pišti nekoliko puta.</li>
                            <li>...</li>
                        </ul>
                        <p>Osim unapredjene tehničke službe unapredili smo i brzu hitnu službu koji radi 24 časa. Ukoliko vam se laptop pokvari u toku noći a želite trenutnu popravku vašeg uredjaja pozovite našu Hitnu službu. Naši tehničari ce doći po vaš računar i započinju odmah popravku. Ukoliko nisu u mogućnosti da za kratko vreme reše problem daju vam drugi ispravan laptop dok je vaš u servisu.</p>
                        <a class="btn btn-secondary" href="contact.html">Kontakt forma</a>
                    </div>
                    <div class="col-12 col-lg-6">
                        <img src="assets/img/index-support.jpg" alt="laptop serviser" class="img-fluid" />
                    </div>
                </div>`;
    document.getElementById("podrska").innerHTML = html;
}

function nizProizvodaNaAkciji(nizProizvoda) {
    let nizAkcija = [];

    for(let p of nizProizvoda) {
        if(p.akcija) {
            nizAkcija.push(p);
        }
    }

    return nizAkcija;
}

function ispisSlider(nizProizvoda) {

    let nizProizvodaAkcija = nizProizvodaNaAkciji(nizProizvoda);

    let html = `
    <h3 class='text-center text-warning py-2'>Pogledajte neke od proizvoda na akciji</h3>
    <hr />
    <div id="carousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <a href="products.html"><img src="${nizProizvodaAkcija[0].slika.src}" class="d-block w-100" alt="${nizProizvodaAkcija[0].slika.alt}"></a>
                <div class="carousel-caption d-none d-md-block text-dark ">
                    <hr />
                    <h5>${nizProizvodaAkcija[0].nazivProizvoda}</h5>
                </div>
            </div>`;

    for(let i = 1; i <= nizProizvodaAkcija.length - 1; i++) {
        html += `
        <div class="carousel-item">
            <a href="products.html"><img src="${nizProizvodaAkcija[i].slika.src}" class="d-block w-100" alt="${nizProizvodaAkcija[i].slika.alt}"></a>
            <div class="carousel-caption d-none d-md-block text-dark">
                <hr />
                <h5>${nizProizvodaAkcija[i].nazivProizvoda}</h5>
            </div>
        </div>`;
    }      
    html += `</div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>`;

    
    document.getElementById("autoCarousel").innerHTML = html;
}
//#endregion

//#region prodcurts
function onPromena(){
    let proizvodi = lsGet("proizvodi");
    ispisProizvoda(proizvodi);
}

function ispisProizvoda(nizProizvoda) {
    let html = `<div class='row d-flex justify-content-around'>`;
    nizProizvoda = filterProcesori(nizProizvoda);
    nizProizvoda = filterGraficke(nizProizvoda);
    nizProizvoda = filterProizvodjaci(nizProizvoda);
    nizProizvoda = sortProizvodi(nizProizvoda);
    nizProizvoda = searchProizvodi(nizProizvoda);

    let br = 1;
    for(let p of nizProizvoda) {
        html += `<div class='card product bg-light my-3 col-12 col-lg-4'>
                    <img src=${p.slika.src} class='card-img-top' alt=${p.slika.alt} />`
                    if(p.akcija) {
                        html += `<span class="position-absolute p-2 m-2 top-0 end-0 badge rounded bg-danger">Akcija</span>`
                    }
                    html += `
                        <div class='card-body'>
                            <h5 class='card-title'>${p.nazivProizvoda}</h5>
                            <hr />
                        <div class='price'>`
                            if(p.cena.staraCena === 0) {
                                html += `<p> </p>`
                            } else {
                                html += `<p class='text-secondary m-0 staraCena'>Stara cena: ${obradaCene(p.cena.staraCena)}</p>`
                            }
                            html += `<p class=' fw-bold trenutnaCena'>${obradaCene(p.cena.trenutnaCena)}</p>
                        </div>
                        <div class="add-to-cart">
                            <button onclick="addToCart(${br})" class="btn btn-secondary btn-addtocart"><i class="fa fa-shopping-cart"></i> Dodaj u korpu</button>
                        </div>
                    </div>
                </div>
        `;          
        br++;        
    }
    html += '</div>'
    document.getElementById("products").innerHTML = html;
}

function ispisGrupeFilterCheckboxova(nizSaOpcijama, nazivFiltera, idFiltera, klasaFiltera) {
    html = `<div class='aside border rounded p-2 mb-3' id='${idFiltera}'>
                <h5 class='aside-title'>${nazivFiltera}</h5>
                    <hr />
                    `;
    let br=1;

    for(let opcija of nizSaOpcijama) {
    html += `<div class='mb-2'>
                <input class="form-check-input mt-0 ${klasaFiltera}" type="checkbox" value='${br}' id='${idFiltera+br}' /> 
                <label for='${idFiltera+br}'>${opcija.imeProizvodjaca}</label>
                </div>`;
    br++;
}
html += "</div>";

document.getElementById("filters").innerHTML += html;
}

function ispisDDl(nizOpcija, idListe, idDiv, tip){
    let html = `
                    <select class="form-select" id="${idListe}">
                        <option value="0">Izaberite opciju</option>`;
                        
                    for(let opcija of nizOpcija){
                        if(tip == "sort"){
                            html += `<option value="${opcija.vrednost}">${opcija.naziv}</option>`
                        }
                        if(tip == "gradovi") {
                            html += `<option value="${opcija.id}">${opcija.imeGrada}</option>`
                        }
                        if(tip == "proizvodjaci") {
                            html += `<option value="${opcija.id}">${opcija.imeProizvodjaca}</option>`
                        }
                        
                    }
                html += `</select>
        `;

    document.querySelector(`#${idDiv}`).innerHTML += html;
}

function obradaCene(x) {
    var parts = x.toString().split(".");
    parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
    return parts.join(",") + " RSD";
}

function lsSet(naziv, vrednost){
    localStorage.setItem(naziv, JSON.stringify(vrednost));
}

function lsGet(naziv){
    return JSON.parse(localStorage.getItem(naziv));
}

//#region filter funkcije

function sortProizvodi(nizProizvoda){
    let sortiraniNiz = [];
    let izbor = $("#ddlSort").val();
    if(izbor == "0"){
        sortiraniNiz = nizProizvoda;
    
    }
    else{
        sortiraniNiz = nizProizvoda.sort(function(a, b){
            if(izbor == "cena-asc"){
                return a.cena.trenutnaCena - b.cena.trenutnaCena;
            }
            if(izbor == "cena-desc"){
                return b.cena.trenutnaCena - a.cena.trenutnaCena;
            }
            if(izbor == "naziv-asc"){
                if(a.nazivProizvoda < b.nazivProizvoda){
                    return -1;
                }
                else if(a.nazivProizvoda > b.nazivProizvoda){
                    return 1;
                }
                else{
                    return 0;
                }
            }
            if(izbor == "naziv-desc"){
                if(a.nazivProizvoda > b.nazivProizvoda){
                    return -1;
                }
                else if(a.nazivProizvoda < b.nazivProizvoda){
                    return 1;
                }
                else{
                    return 0;
                }
            }   
        })
    }
    return sortiraniNiz;
}

function searchProizvodi(nizProizvoda) {
    let unetiTekst = $("#tbSearch").val();
    return nizProizvoda.filter(x => {
        if (x.nazivProizvoda.toLowerCase().indexOf(unetiTekst.toLowerCase().trim()) != -1)
            return x;
    })
}

function clearTb() {
    let nizProizvoda = lsGet("proizvodi");
    document.getElementById("tbSearch").value = "";
    ispisProizvoda(nizProizvoda);
}

function filterGraficke(nizProizvoda) {
    let cekiraniProizvodjaciGrafickih = [];
    for (let i = 0; i < $(".input-graficke:checked").length; i++)
    cekiraniProizvodjaciGrafickih.push(parseInt($(".input-graficke:checked")[i].value))
    if (cekiraniProizvodjaciGrafickih.length != 0)
        return nizProizvoda.filter((x) => cekiraniProizvodjaciGrafickih.includes(x.specifikacije.grafickaKartica.proizvodjacGrafickeKarticeId));
    return nizProizvoda;
}

function filterProcesori(nizProizvoda) {
    let cekiraniProizvodjaciProcesora = [];
    for (let i = 0; i < $(".input-procesori:checked").length; i++)
    cekiraniProizvodjaciProcesora.push(parseInt($(".input-procesori:checked")[i].value))
    if (cekiraniProizvodjaciProcesora.length != 0)
        return nizProizvoda.filter((x) => cekiraniProizvodjaciProcesora.includes(x.specifikacije.procesor.proizvodjacProcesoraId));
    return nizProizvoda;
}

function filterProizvodjaci(nizProizvoda) {
    let cekiraniProizvodjaci = [];
    for (let i = 0; i < $(".input-proizvodjaci:checked").length; i++)
    cekiraniProizvodjaci.push(parseInt($(".input-proizvodjaci:checked")[i].value))
    if (cekiraniProizvodjaci.length != 0)
        return nizProizvoda.filter((x) => cekiraniProizvodjaci.includes(x.proizvodjacId));
    return nizProizvoda;
}

//#endregion
//#endregion

//#region cart
const alertPlaceholder = document.getElementById('liveAlertPlaceholder');

const alert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper);
}

function ispisPrazneKorpe() {
    html = `
            <div>
                <h3 class='my-5 text-center'>Nema proizvoda u korpi.</h3>
            </div>`;

    document.getElementById("korpaTabela").innerHTML = html;
    document.getElementById("divfinalno").innerHTML = "";
    document.getElementById("divfinalno").classList.remove('bg-light', 'border');
}

function ispisKorpe() {
    let proizvodiIzKorpe = lsGet('korpa');
    let proizvodi = lsGet('proizvodi');
    let html = "";
    let br = brProizvodaUkorpi();

    if(br == 0 || proizvodiIzKorpe == null) {
        localStorage.removeItem("korpa");
        ispisPrazneKorpe();
    }
    else {
        html = `<table class="table table-striped border">
        <thead class="table-header text-light bg-dark text-center">
            <tr>
                <th> </th>
                <th>Naziv Proizvoda</th>
                <th>Cena</th>
                <th>Količina</th>
                <th>Končna cena</th>
                <th> </th>
            </tr>
        </thead>
        <tbody>`;
        let ukupno = 0;
        for(let proizvod of proizvodi) {
            for(let p of proizvodiIzKorpe) {
                if(proizvod.id == p.id) {
                    html+= ` <tr>
                                <td>
                                    <img class="img-fluid slika-korpa" src="${proizvod.slika.src}" alt="${proizvod.slika.alt}" />
                                </td>
                                <td class="align-middle text-center">${proizvod.nazivProizvoda}</td>
                                <td class="align-middle text-center" id="cenaKomad${p.id}">${obradaCene(proizvod.cena.trenutnaCena)}</td>
                                <td class="align-middle text-center">
                                    <div class="cartKolicina">
                                        <button id="smanji${p.id}" onclick="smanji(${p.id})" data-id="${p.id}" class='btn btn-secondary btnSmanji'>-</button>
                                            <input type='text' name='korpaProizvodKolicina${p.id}' class='btn btn-secondary' id='korpaProizvodKolicina${p.id}' disabled='disabled' size='1' value='${p.kolicina}' />
                                        <button id="povecaj${p.id}" onclick="povecaj(${p.id})" data-id="${p.id}" class='btn btn-secondary btnPovecaj'>+</button>
                                    </div>
                                </td>
                                <td class="align-middle text-center" id="ukupnaCena${p.id}">${obradaCene(proizvod.cena.trenutnaCena * p.kolicina)}</td>
                                <td class="align-middle text-center">
                                <div class="cartIzbaci">
                                    <button onclick="izbrisiProizvod(${p.id})" class="btn btn-danger btnIzbaciIzKorpe">Izbaci</button>
                                </div>
                                </td>
                            </tr>`;
                            ukupno += proizvod.cena.trenutnaCena * p.kolicina;

                            ispisDivFinalnaCena(ukupno);
                            console.log(ukupno);
                         
                    }
            }
        }
        html += `
        </tbody>
        </table>`;

        document.getElementById("korpaTabela").innerHTML = html;
    }

}

function ispisDivFinalnaCena(cena) {

        document.getElementById("divfinalno").classList.remove("d-none");
        let html = `
        <h2>Ukupna cena:</h2>
        <span id="cenaTotal" class='fs-3 fw-bold'>${obradaCene(cena)}</span>
        <button id="btnPoruci" class="btn btn-success">Poručite</button> `;
        
        document.getElementById("divfinalno").innerHTML = html;

}

let proizvodiUnutarKorpe = [];
function addToCart(id, brojStavki) {
    if (brojStavki == undefined)
        brojStavki = 1;

    if (!localStorage.getItem("korpa")) {
        dodajPrviProizvod(id);
        brProizvodaUkorpi();
    }
    else {
        let korpa = lsGet("korpa");
        let xd = korpa.find(x => x.id == id)
        if (!xd) {
            dodajNoviProizvod(id);
            brProizvodaUkorpi();
        }
        else {
            daLiJeUKorpi(id);
        }
    }

    function dodajPrviProizvod(idProduct) {
        let zaKorpu = ({
            id: idProduct,
            kolicina: brojStavki
        })
        proizvodiUnutarKorpe.push(zaKorpu);
        alert("Proizvod dodat u korpu.", "success");
        lsSet("korpa", proizvodiUnutarKorpe);
        brProizvodaUkorpi();
    }

    function dodajNoviProizvod(idProduct) {
        let zaKorpu = ({
            id: idProduct,
            kolicina: brojStavki
        })
        let korpa = lsGet("korpa");
        korpa.push(zaKorpu);
        brProizvodaUkorpi();
        alert("Proizvod dodat u korpu.", "success");
        lsSet("korpa", korpa);
    }

    function daLiJeUKorpi(idProduct) {
        let korpa = lsGet("korpa");
        let xd = korpa.find(x => x.id == idProduct);
        
        korpa.forEach(p => {
            if(p.id == xd.id) {
                alert("Proizvod je vec u korpi.", "danger");
            } 
        })
    }
}

function izbrisiProizvod(id) {
    let proizvodi = lsGet('korpa');
    let filtrirani = proizvodi.filter(p => p.id != id);
    
    lsSet('korpa', filtrirani);

    brProizvodaUkorpi();
    ispisKorpe();  
}

function brProizvodaUkorpi() {
    let korpa = lsGet("korpa");

    if(korpa == null) {

        document.getElementById("cartItemsCounter").innerHTML = 0; 
        return 0;   
    }
    else {
        let br=0;
        korpa.forEach(p => {
            br++;
        })
     
        document.getElementById("cartItemsCounter").innerHTML = br;    
        return br;
    }

}


function povecaj(id) {  
    let proizvodi = lsGet('korpa');

    for(let p of proizvodi) {
        if(p.id == id) {
            p.kolicina++;
            lsSet('korpa', proizvodi); 
        } 
    }   
    ispisKorpe();
}

function smanji(id) {
    let proizvodi = lsGet("korpa");

    for(let p of proizvodi) {
        if(p.id == id) {
            if(p.kolicina <= 1)
            {
                p.kolicina == 1;
            }
            else {
                p.kolicina--;
                lsSet('korpa', proizvodi);
            }

        }
    }

    ispisKorpe();
}

function osveziKorpu() {
    ispisKorpe();
}

//#endregion

//#region contact   

function ispisKontakt() {
    let html = `
                <h3>Dobrodošli na stranicu za slanje tiketa.</h3>
                <hr />
                <p class='ms-3'>Ovo je stranica gde možete poslati informacije o Vašem uređaju i proveriti dostupnost naših usluga po gradovima</p> `;   
                
    document.getElementById("contactinfo").innerHTML = html;
}
//#region ispitivanje elemenata forme
function proveraForme(e) {

    e.preventDefault();

    let greske = [];

    let formaUser = $("#tbUser").val();
    let formaEmail = $("#tbUserEmail").val();
    let formaDdlGradovi = $("#ddlGradovi").val();
    let formaDdlProizvodjaci = $("#ddlProizvodjaci").val();
    let formaTextArea = $("#taOpis").val();
    let formaCb = document.getElementById("cbTos").checked;

    let tbUserErrorSpan = document.getElementById("tbEmailError");
    let tbEmailErrorSpan = document.getElementById("tbUserError");
    let ddlGradoviErrorSpan = document.getElementById("ddlGradoviError");
    let ddlProizvodjaciErrorSpan = document.getElementById("ddlProizvodjaciError");
    let textAreaErrorSpan = document.getElementById("taError");
    let cbPromocijeErrorSPan = document.getElementById("cbTosError");
    let uspesnoPoslato = document.getElementById("uspesnoPoslato");

    let userRegex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(!userRegex.test(formaUser)) {
        tbUserErrorSpan.classList.add("text-danger");
        tbUserErrorSpan.innerHTML = "Pogrešno korisničko ime.";
        greske.push("greska user");
    } else {
        tbUserErrorSpan.innerHTML = "";

    }

    if(!emailRegex.test(formaEmail)) {
        tbEmailErrorSpan.classList.add("text-danger");
        tbEmailErrorSpan.innerHTML = "Pogrešan email.";
        greske.push("greska email");
    } else {
        tbEmailErrorSpan.innerHTML = "";
    }

    if(formaDdlGradovi == 0) {
        ddlGradoviErrorSpan.classList.add("text-danger");
        ddlGradoviErrorSpan.innerHTML = "Izaberite grad.";
        greske.push("greska gradovi");
    } else {
        ddlGradoviErrorSpan.innerHTML = "";
    }

    if(formaDdlProizvodjaci == 0) {
        ddlProizvodjaciErrorSpan.classList.add("text-danger");
        ddlProizvodjaciErrorSpan.innerHTML = "Izaberite grad.";
        greske.push("greska proizvodjaci");
    } else {
        ddlProizvodjaciErrorSpan.innerHTML = "";

    }

    if(formaTextArea.length < 15) {
        textAreaErrorSpan.classList.add("text-danger");
        textAreaErrorSpan.innerHTML = "Dajte malo detaljniji opis.";
        greske.push("greska ta");
    } else {
        textAreaErrorSpan.innerHTML = "";

    }

    if(!formaCb) {
        cbPromocijeErrorSPan.classList.add("text-danger");
        cbPromocijeErrorSPan.innerHTML = "Morate se složiti sa uslovima korišćenja";
        greske.push("greska cb");
    } else {
        cbPromocijeErrorSPan.innerHTML = "";

    }

    if(greske.length == 0) {
        uspesnoPoslato.classList.add("text-success", "fs-3");
        uspesnoPoslato.innerHTML = "Tiket poslat.";
    }
}

function ispitajEmail(vrednostMaila, spanZaIspisGreske) {
   
    let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if(!emailRegex.test(vrednostMaila)) {
        spanZaIspisGreske.innerHTML = "Pogresan format emaila. primer: petar.petrovic@gmail.com";
    } else {
        spanZaIspisGreske.classList.remove("text-danger");
        spanZaIspisGreske.classList.add("text-success");
        spanZaIspisGreske.innerHTML = "email poslat!";
    }
}

let btnPrijavaNl = document.getElementById("btnPrijavaNl");
btnPrijavaNl.addEventListener("click", function() {
    let nlEmailValue = document.getElementById("tbEmailNl").value;
    let spanErr = document.getElementById("emailNlErr");
    ispitajEmail(nlEmailValue, spanErr);
});
//#endregion



//#endregion

