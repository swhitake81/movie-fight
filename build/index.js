var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { createAutoComplete } from './autocomplete';
const autoCompleteConfig = {
    renderOption(movie) {
        const imgsrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgsrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    fetchData(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios.get('http://www.omdbapi.com/', {
                params: {
                    apikey: '797b0801',
                    s: searchTerm
                }
            });
            if (response.data.Error) {
                return [];
            }
            return response.data.Search;
        });
    }
};
createAutoComplete(Object.assign(Object.assign({}, autoCompleteConfig), { root: document.querySelector('#left-autocomplete'), onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    } }));
createAutoComplete(Object.assign(Object.assign({}, autoCompleteConfig), { root: document.querySelector('#right-autocomplete'), onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    } }));
let leftMovie;
let rightMovie;
const onMovieSelect = (movie, summaryElement, side) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '797b0801',
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);
    if (side === 'left') {
        leftMovie = response.data;
    }
    else {
        rightMovie = response.data;
    }
    if (leftMovie && rightMovie) {
        runComparison();
    }
});
const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        const leftSideValue = parseInt(leftStat.dataset.values);
        const rightSideValue = parseInt(rightStat.dataset.value);
        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }
        else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};
const movieTemplate = (movieDetail) => {
    // const dolAmt = movieDetail.BoxOffice;
    // console.log(dolAmt);
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$|,/g, ''));
    console.log(dollars);
    const metascore = parseInt(movieDetail.Metascore);
    const rating = parseFloat(movieDetail.imdbRating);
    const votes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return prev;
        }
        else
            return prev + value;
    }, 0);
    console.log(awards);
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
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
        <article data-value=${rating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">iMDB Rating</p>
        </article>
        <article data-value=${votes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">iMDB Votes</p>
        </article>
    `;
};
