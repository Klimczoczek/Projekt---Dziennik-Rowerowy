//zmienne / elementy
const f_od = document.querySelector('#od');
const f_do = document.querySelector('#do');
const f_ile = document.querySelector('#ile');
const f_dystans = document.querySelector('#dystans');
const f_data = document.querySelector('#data');
const nmiesiace = ['Styczniu','Lutym','Marcu','Kwietniu','Maju','Czerwcu','Lipcu','Sierpniu','Wrzesniu','Listopadzie','Grudniu']



if((localStorage.getItem("id") === null)){
    localStorage.setItem('id',0);
}
// localStorage.setItem('rcel',200);
// localStorage.setItem('cel',2000);
// localStorage.setItem('name','Lukooooooosz');
// localStorage.setItem('surname','Klima');



//singlepage system
const sp = (nr) =>{
    const w_add = document.querySelector('#w_add');
    const w_pods = document.querySelector('#w_pods');
    const w_edit = document.querySelector('#w_edit');
    if(nr == 0){
        w_add.style.display = 'none';
        w_pods.style.display = 'flex';
        w_edit.style.display = 'none';
    }
    else if(nr == 1){
        w_add.style.display = 'block';
        w_pods.style.display = 'none';
        w_edit.style.display = 'none';        
    }
    else if(nr == 2){
        w_add.style.display = 'none';
        w_pods.style.display = 'none';
        w_edit.style.display = 'block';        
    }
}



const czywszystko = (formul) =>{
    const alinput = Array.from(document.forms[formul].querySelectorAll('input'));
    let czy = true;
    alinput.pop()
    alinput.map(cell=>{
        // console.log(cell.value);
        if(cell.value == '' && czy == true){
            // console.log('puste')
            czy = false;

        }
    })
    console.log(czy)
    return czy
    // console.log(alinput)
}




//render - wyświetlanie

const render = () =>{
    clear_table();
    for(let i=1;i<=parseInt(localStorage.getItem("id"));i++){
        render_table(i);
    }
    create_pods()
    getWeather()
}

//obliczanie





// podusmowanie
const create_pods = () =>{
    const p_name = document.querySelector('#namesur')
    const p_cel = document.querySelector('#cel')
    const p_rcel = document.querySelector('#rcel')
    const p_wszystko = document.querySelector('#wszystko')
    const p_spre = document.querySelector('#spre')
    const p_udal = document.querySelector('#udal')

    //obliczanie dystansu
    let dystans = 0;
    for(let i=1;i<=parseInt(localStorage.getItem("id"));i++){
        const ls=JSON.parse(localStorage.getItem(i));
        dystans = dystans + parseInt(ls.f_dystans);
    }
    
    //obliczanie sumy godzin
    let sgodziny = 0;
    for(let i=1;i<=parseInt(localStorage.getItem("id"));i++){
        const ls=JSON.parse(localStorage.getItem(i));
        sgodziny = sgodziny + parseInt(ls.f_ile);
    }

    //obliczanie z danego miesiąca
    let mosum = 0;
    const data = new Date();
    const miesiac = data.getMonth();
    for(let i=1;i<=parseInt(localStorage.getItem("id"));i++){
        const ls=JSON.parse(localStorage.getItem(i));
        const wdata = new Date(ls.f_data);
        const wmies = wdata.getMonth();
        if(wmies == miesiac){
            mosum = mosum + parseInt(ls.f_dystans);
        }
    }


    //wszystkie cele liczy
    let rcelos = []
    for(let i=1;i<=parseInt(localStorage.getItem("id"));i++){
        const ls=JSON.parse(localStorage.getItem(i));
        rcelos.push(parseInt(ls.f_dystans));
    }


    //czy jest imie
    if(localStorage.getItem("name") === null || localStorage.getItem("surname") === null){
        p_name.style = "visibility: hidden;";
    }
    else{
        p_name.innerHTML = localStorage.getItem("name")+" "+localStorage.getItem("surname");
        p_name.style = "visibility: show;";
    }

    //czy jest cel
    if(localStorage.getItem("cel") === null){
        p_cel.innerHTML = 'Cel w '+nmiesiace[miesiac]+': '+mosum+'/--- km';
        if(mosum >= localStorage.getItem('cel')){
            p_cel.style = 'color: green;';
        }
        else{
            p_cel.style.removeProperty("color");
        }
    }
    else{
        p_cel.innerHTML = 'Cel w '+nmiesiace[miesiac]+': '+mosum+'/'+localStorage.getItem('cel')+' km';
        if(mosum >= localStorage.getItem('cel')){
            p_cel.style = 'color: green;';
        }
        else{
            p_cel.style.removeProperty("color");
        }
    }

    //czy jest rcel
    if(localStorage.getItem("rcel") === null){
        p_rcel.innerHTML = 'Dzienny cel: --- km'
    }
    else{
        p_rcel.innerHTML = 'Dzienny cel: '+localStorage.getItem('rcel')+' km'
    }



    //cały dystans -- !!!!!! reduce
    const ar_dystans = [];
    for(let i=1;i<=parseInt(localStorage.getItem("id"));i++){
        const ls=JSON.parse(localStorage.getItem(i));
        ar_dystans.push(parseInt(ls.f_dystans));
    }
    if (ar_dystans.length > 0){
        p_wszystko.innerHTML = 'Cały dystans: '+ar_dystans.reduce((acc, cur) => acc + cur)+' km'
    }
    else{
        p_wszystko.innerHTML = 'Cały dystans: 0 km'
    }


    //średnia prędkość
    if(isNaN(Math.round(dystans/sgodziny))){
        p_spre.innerHTML = 'Twoja średnia prędkość: -- km/h'
    }
    else{
        p_spre.innerHTML = 'Twoja średnia prędkość: '+Math.round(dystans/sgodziny)+' km/h'
    }


    //cel -- !!!!!!! filter
    if(localStorage.getItem("rcel") === null ){
        p_udal.innerHTML = 'Brak danych o celu dziennym'
    }
    else{
        p_udal.innerHTML = 'Udało ci się osiągnąć cel dzienny '+rcelos.filter(item => item >= localStorage.getItem('rcel')).length+' / '+localStorage.getItem('id')+' razy';
    }
}

//pobieranie wartosci z podsumowania
document.querySelector("#edit").addEventListener("click", ()=>{
        const e_imie = document.querySelector('#e_imie');
        const e_nazwisko = document.querySelector('#e_nazwisko');
        const e_cel = document.querySelector('#e_cel');
        const e_rcel = document.querySelector('#e_rcel');

        const rcel = localStorage.getItem('rcel')
        const cel = localStorage.getItem('cel');
        const name = localStorage.getItem('name');
        const surname = localStorage.getItem('surname');

        if(name != null){
            e_imie.value = name;
        }
        if(surname != null){
            e_nazwisko.value = surname;
        }
        if(cel != null){
            e_cel.value = cel;
        }
        else{
            e_cel.value = 0;
        }
        if(rcel != null){
            e_rcel.value = rcel;
        }
        else{
            e_rcel.value = 0;
        }

        sp(2);

    });

    document.querySelector("#edit_m").addEventListener("click", ()=>{
        if(czywszystko('form_edit')){
        const fedit_err = document.querySelector('#fedit_err');
        const e_imie = document.querySelector('#e_imie');
        const e_nazwisko = document.querySelector('#e_nazwisko');
        const e_cel = document.querySelector('#e_cel');
        const e_rcel = document.querySelector('#e_rcel');

        // fedit_err.style = 'display:none; color:red;';
        fedit_err.style = "visibility: hidden;";

        localStorage.setItem('name',e_imie.value);
        localStorage.setItem('surname',e_nazwisko.value);
        localStorage.setItem('cel',e_cel.value);
        localStorage.setItem('rcel',e_rcel.value);

        render();
        sp(0);
        }
        else{
            // fedit_err.style.removeProperty('display');
            fedit_err.style = "visibility: show;";
            fedit_err.style = 'color:red;'
        }

    });






const clear_table = () =>{
    const table = document.querySelector('#tablica');
    const tablenum = document.querySelector('#tablica').rows.length;
    for(let i=1;i<tablenum;i++){
        table.deleteRow(-1);
    }

}

const render_table = (id) =>{
    const ls=JSON.parse(localStorage.getItem(id));
    const table = document.querySelector('#tablica');
    const row = table.insertRow(-1);
    const rcel = localStorage.getItem('rcel');
    row.setAttribute("ondblclick",`delfls(${id})`)
    row.setAttribute("title","Aby usunąć naciśnij 2 razy na wiersz")
    const t_data = row.insertCell(0);
    const t_od = row.insertCell(1);
    const t_do = row.insertCell(2);
    const t_ile = row.insertCell(3);
    const t_dystans = row.insertCell(4);
    t_od.innerHTML = ls.f_od
    t_do.innerHTML = ls.f_do
    t_ile.innerHTML = ls.f_ile
    t_dystans.innerHTML = ls.f_dystans
    t_data.innerHTML = ls.f_data

    if(parseInt(ls.f_dystans) >= parseInt(rcel)){
        t_dystans.style = 'color: green;'
    }
    else if(parseInt(ls.f_dystans) < parseInt(rcel)){
        t_dystans.style = 'color: red;'
    }
    
}

//usuwanie

const delfls = (id) =>{
    const x = parseInt(localStorage.getItem('id'));
    // console.log(x)
    let arr = [];
    for(let i=1;i<=x;i++){
        if(parseInt(i) == parseInt(id)){
            continue;
        }
        else{
        const key = localStorage.getItem(i);
        arr.push(key);
    }
    }
    // console.log(arr);
    // console.log(x-1)


    //to co się nie usuwa
    const rcel = localStorage.getItem('rcel')
    const cel = localStorage.getItem('cel');
    const name = localStorage.getItem('name');
    const surname = localStorage.getItem('surname');

    localStorage.clear();
    localStorage.setItem('id',x-1);
    licz = 1;
    arr.forEach(element => {
        localStorage.setItem(parseInt(licz),element);
        licz = licz+1;
    });


    //przywracanie
    if(rcel != null){
        localStorage.setItem('rcel',rcel);
    }
    if(cel != null){
        localStorage.setItem('cel',cel);
    }
    if(name != null){
        localStorage.setItem('name',name);
    }
    if(surname != null){
        localStorage.setItem('surname',surname);
    }
    
    


    render();

}


// API
const a_key = "abfa6300e5cf70f835e7263ea3078a60"
const a_Url = `https://api.openweathermap.org/data/2.5/weather?q=Gliwice&appid=${a_key}&units=metric`

const getWeather = async () => {
    const response = await fetch(a_Url)
    let data = await response.json()
    let tempera = Math.round(parseInt(data.main.temp))
    if (tempera >= 10){
        wynik.innerHTML = `Teraz jest idealna temperatura na rower: ${tempera} °C`
    }
    else{
        wynik.innerHTML = `Teraz nie jest najlepszy dzień na rower: ${tempera} °C (lepiej zabierz coś ciepłego)`
    }
    // console.log(data)
    // wynik.innerHTML = `Temperatura dla ${data.name} = ${Math.round(parseInt(data.main.temp))} °C`
    // console.log(data.main.temp)
};




// dodawanie
document.querySelector("#add").addEventListener("click", ()=>{
    if(czywszystko('form_add')){
    const fadd_err = document.querySelector('#fadd_err');
    // fadd_err.style = 'display:none; color:red;';
    fadd_err.style = "visibility: hidden;";
    //jeśli pusty
    if (localStorage.getItem("id") === null) {
        localStorage.setItem("id",1)
        let zawartosc ={
    f_od:f_od.value,
    f_do:f_do.value,
    f_ile:f_ile.value+' h',
    f_dystans:f_dystans.value+' km',
    f_data:f_data.value 
} 

localStorage.setItem(1,JSON.stringify(zawartosc));
render()
}
else{
    let nid=parseInt(localStorage.getItem("id"))+1;
    let zawartosc ={
        f_od:f_od.value,
        f_do:f_do.value,
        f_ile:f_ile.value+' h',
        f_dystans:f_dystans.value+' km',
        f_data:f_data.value 
    } 
    
    localStorage.setItem(nid,JSON.stringify(zawartosc) );
    localStorage.setItem("id",nid);
    render()
    

}
}
else{
    // fadd_err.style.removeProperty('display');
    fadd_err.style = "visibility: show;";
    fadd_err.style = 'color:red;'
}
});