 
 const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc=movie.Poster==='N/A'?'':movie.Poster;
    return `
    <img src="${imgSrc}"/>
    ${movie.Title} (${movie.Year})
    `     
  },

  inputValue(movie) {
    return movie.Title;
  },

  async fetchData(term) {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey:'bcb089fb',
        s: term
      }
    });
    if(response.data.Error){
      return [];
    }
    return response.data.Search;
   }

 }
 
createAutoComplete({...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden');
    onselect(movie, document.querySelector('#left-summary'),'left');
  },
  root:document.querySelector('#left-autocomplete')
});

createAutoComplete({...autoCompleteConfig,
  onOptionSelect(movie) {
    
    onselect(movie, document.querySelector('#right-summary'),'right');
  },
  root:document.querySelector('#right-autocomplete')
});
 
let leftMovie,rightMovie;

const onselect = async (movie, summaryElement,side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
     params: {
       apikey:'bcb089fb',
       i:movie.imdbID
     }
   });
   
   summaryElement.innerHTML = movieTemp(response.data);
   if(side === 'right') {
     rightMovie = response.data;
   } else {
     leftMovie = response.data;
   }

   if(leftMovie && rightMovie) {
     runComparison();
   }

} ;

const runComparison = () => {
  const leftSide = document.querySelectorAll('#left-summary .notification');
  const rightSide = document.querySelectorAll('#right-summary .notification');

  leftSide.forEach((leftStat, index) => {

    const rightStat = rightSide[index];
    console.log(rightStat, leftStat);
    const leftStatValue = leftStat.dataset.value;
    const rightStatValue = rightStat.dataset.value;

    if(leftStatValue > rightStatValue) {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    } else {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    }

  })

}

const movieTemp = (movieDetail) => {
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
  const awards = movieDetail.Awards.split(' ').reduce((prev,word) => {
    const value = parseInt(word);
    if(isNaN(value)){
      return prev;
    } else {
      return prev + value;
    }

  },0);


  return `    
   <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h1>${movieDetail.Genre}</h1>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
   </article>


   <article data-value=${awards} class="notification is-primary">
     <p class="title">${movieDetail.Awards}</p>
     <p class="subtitle">Awards</p>
   </article>
   <article data-value=${dollars} class="notification is-primary">
     <p class="title">${movieDetail.BoxOffice}</p>
     <p class="subtitle">Box Office</p>
   </article>
   <article data-value=${metascore} class="notification is-primary">
     <p class="title">${movieDetail.Metascore}</p>
     <p class="subtitle">Metascore</p>
   </article>
   <article data-value=${imdbRating} class="notification is-primary">
     <p class="title">${movieDetail.imdbRating}</p>
     <p class="subtitle">IMDB Rating</p>
   </article>
   <article data-value=${imdbVotes} class="notification is-primary">
     <p class="title">${movieDetail.imdbVotes}</p>
     <p class="subtitle">IMDB Votes</p>
   </article>

   

 `

}