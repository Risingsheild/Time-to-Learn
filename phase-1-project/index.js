/* organize each function and how they are used into the design,
    toggle both the Search anime tab as well as the Charactar tab for cleaner results
    load multple pages to the screen when needed, 
    make sure all search suggestions start at the beginning of the name. */

let option = `quotes`; 
let searchAnime = false; 
let searchChar = false; 
let pageNum = 1;  
let animeLength = 0; 
let charLength = 0; 

// load all button when Dom is loaded 

document.addEventListener('DOMContentLoaded', () => {
    initializeFormsAndBtns();

});

//Using Json to fetch all anime quotes from the API
function fetchAnimeQuotes(option){
    fetch(`https://animechan.vercel.app/api/${option}`)
    .then(resp => resp.json())
    .then(obj => {
        if(option === 'available/anime'){
            loadAvailableAnime(obj);
        }
        else{
            loadAnimeQuotes(obj);
        }
    })
    .catch(error => alert(error));
}

// Retrieves the quoutes and loads them onto the screen
function loadAnimeQuotes(quoteObj){
    const quoteList = document.getElementById('quote-list');
    quoteList.textContent = '';
    document.getElementById('anime-list').textContent = '';
    document.getElementById('back').style.display = 'none';
    document.getElementById('forward').style.display = 'none';

    if(option.includes('quotes')){

        if(option.includes(pageNum) && option.includes('anime')){
            pageNav(option.slice(19, 19 + animeLength));
        }
        else if(option.includes(pageNum) && option.includes('character')){
            pageNav(option.slice(21, 20 + animeLength));
        }

        for(let key in quoteObj){
            let li = makeQuote(quoteObj[key]);
            if(li === undefined){

            }
            quoteList.appendChild(li);
        }
    }
    else{ //loads random quote
        let li = makeQuote(quoteObj);
        quoteList.appendChild(li);
    }
}

//loads available Animes
function loadAvailableAnime(animeObj){
    const animeList = document.getElementById('anime-list');
    animeList.textContent = '';
    document.getElementById('quote-list').textContent = '';
    document.getElementById('back').style.display = 'none';
    document.getElementById('forward').style.display = 'none';


    const subTitle = document.createElement('h3');
// text should match and be centered
    subTitle.textContent = 'Available Anime';
    animeList.appendChild(subTitle);
    
    for(let item in animeObj){
        let li = document.createElement('li');
        li.id = animeObj[item];
        li.textContent = animeObj[item];
        animeList.appendChild(li);
        animeList.appendChild(document.createElement('br'));
    }
}


//Creates an Element for Quotes to be seen on page ,
// gives error message when anime not found
function makeQuote(quoteObj){

    const ul = document.createElement('ul');
    ul.id = quoteObj['anime'];

    if(quoteObj['quote'] === undefined && option.includes('anime')){
        ul.textContent = "Anime not found sorry 😔";
        ul.style.textAlign = "center";
        return ul;
    }
    else if(quoteObj['quote'] === undefined && option.includes('character')){
        ul.textContent = "Character not found sorry 😔";
        ul.style.textAlign = "center";
        return ul;
    }

    const blockQuote = document.createElement('blockquote');
    blockQuote.className = 'block-quote';

    const title = document.createElement('h4');
    title.className = 'title';
    title.textContent = quoteObj['anime'];

    const quote = document.createElement('p');
    quote.id = `${quoteObj['anime']} Quote`;
    quote.textContent = `"${quoteObj['quote']}"`;

    const character = document.createElement('footer');
    character.id = quoteObj['character'];
    character.textContent = `-${quoteObj['character']}`;

    blockQuote.appendChild(title);
    blockQuote.appendChild(quote);
    blockQuote.appendChild(character);
    blockQuote.appendChild(document.createElement('br'));
    ul.appendChild(blockQuote);

    return ul;
}

//Lets the form appear and disappear when clicking on the button
function formToggle(form, block){

    block = !block;
    if(block){
        form.style.display = "block";
    }
    else{
        form.style.display = "none";
    }

    return block;
}

// Functions when more than one page of qoutes is populated
// Send alert to user when at the start of the list
function pageNav(animeOption){

    const backBtn = document.getElementById('back');
    const forwardBtn = document.getElementById('forward');

    backBtn.style.display = "block";
    forwardBtn.style.display = "block";

    backBtn.addEventListener('click', () => {
        if(pageNum > 1){
            pageNum--;
            if(option.includes('anime')){
                option = `quotes/anime?title=${animeOption.toLowerCase()}&page=${pageNum}`; 
            }
            else{
                option = `quotes/character?name=${animeOption.toLowerCase()}&page=${pageNum}`;
            }
            fetchAnimeQuotes(option);  
        }
        else{
            alert('We are at the Beginning');
        }
    });
// refresh the page with button to populate more qoutes 
    forwardBtn.addEventListener('click', () => {
        pageNum++;
        if(option.includes('anime')){
            option = `quotes/anime?title=${animeOption.toLowerCase()}&page=${pageNum}`; 
        }
        else{
            option = `quotes/character?name=${animeOption.toLowerCase()}&page=${pageNum}`;
        }
        fetchAnimeQuotes(option);
    })
}

// Global Const for each function and their functions 
// In style add some flair to the buttons to show when you are hovering
function initializeFormsAndBtns(){

    const searchAnimeBtn = document.getElementById('search-anime-btn');
    const searchAnimeForm = document.querySelector('.search-anime-form');

    const searchCharBtn = document.getElementById('search-char-btn');
    const searchCharForm = document.querySelector('.search-char-form');

    const tenQuotesBtn = document.getElementById('ten-random-quotes');
    const randomQuoteBtn = document.getElementById('random-quote');
    const availableAnimeBtn = document.getElementById('available-anime');

    const backBtn = document.getElementById('back');
    const forwardBtn = document.getElementById('forward');

    searchAnimeForm.style.display = "none";
    searchCharForm.style.display = "none";

    backBtn.style.display = "none";
    forwardBtn.style.display = "none";

    searchAnimeBtn.addEventListener('click', () => {
        searchAnime = formToggle(searchAnimeForm, searchAnime);
    });

    searchCharBtn.addEventListener('click', () => {
        searchChar = formToggle(searchCharForm, searchChar);
    });

    tenQuotesBtn.addEventListener('click', () => {
        option = `quotes`;
        fetchAnimeQuotes(option);
    })

    randomQuoteBtn.addEventListener('click', () => {
        option = `random`;
        fetchAnimeQuotes(option);
    })

    availableAnimeBtn.addEventListener('click', () => {
        option = `available/anime`;
        fetchAnimeQuotes(option);
    })

    searchAnimeForm.addEventListener('submit', e => {
        e.preventDefault();
        let animeTitle = Array.from(document.getElementsByClassName('input-text'))[0].value;
        animeLength = animeTitle.length;
        option = `quotes/anime?title=${animeTitle.toLowerCase()}&page=${pageNum}`;
        fetchAnimeQuotes(option);
    });

    searchCharForm.addEventListener('submit', e => {
        e.preventDefault();
        let charName = Array.from(document.getElementsByClassName('input-text'))[1].value;
        charLength = charName.length;
        option = `quotes/character?name=${charName.toLowerCase()}&page=${pageNum}`;
        fetchAnimeQuotes(option);
    })
}
