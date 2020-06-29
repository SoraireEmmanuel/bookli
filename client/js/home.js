import { getRefs, debounce, render } from './utils.js';
import bookService from './book-service.js';

const INPUT_DELAY = 400;
const refs = getRefs();

let state = {
    searchTerm: '',
    status: '',
    books: [],
    booksAmount:'',
};

/**
 * Busca los libros que cumplen con `searchTerm` y
 * actualiza la lista de libros
 **/
async function searchBooks(searchTerm) {
    state.searchTerm = searchTerm;
    const books = await bookService.search(state.searchTerm, state.status);
    cantLibros(books);
    state.books = books;
    renderBooks(state);
}

/**
 * Busca los libros que cumplen con `searchTerm` y
 * actualiza la lista de libros
 **/
async function changeFilter(status) {
    state.status = status;
    searchBooks();
}

/**
 * Obtiene todos los libros disponibles y
 * actualiza la lista de libros
 **/
async function getAllBooks() {
    const books = await bookService.getAll();
    state.books = books;
    cantLibros(books);
    renderBooks(state);
}

/**
 * Renderiza los libros
 **/
function renderBooks(state) {
    render('booklist.html', { books: state.books }, refs.books);
}

/**
 *
 **/
function setUpListeners() {
    refs.search.addEventListener(
        'input',
        debounce((e) => searchBooks(e.target.value), INPUT_DELAY)
    );

    refs.filter.addEventListener('change', (e) => {
        changeFilter(e.target.value);
    });
}
function cantLibros(books){
    state.booksAmount = books.length ;
    document.getElementById('cant').innerHTML=`Cantidad de libros: <strong>${state.booksAmount}</strong>`;
}

/**
 * Inicializa la vista home
 **/
function init() {
    getAllBooks();
    setUpListeners();
}

init();
