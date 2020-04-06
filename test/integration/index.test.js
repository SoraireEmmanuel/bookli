const startServer = require('../../server/src/index.js')
const BookModels = require('../../server/src/models/book.js')

const fetch = require('node-fetch');

let server, baseURL;

beforeAll(async () => {
    server = await startServer();
    baseURL = `http://localhost:${server.address().port}/api/v1`
})

afterAll(() => {
    server.close()
})

afterEach(async () => {
	await BookModels.Book.sync({ force: true });
})

test('Se debería iniciar la aplicación sin libros', async () => {
    const URL = `${baseURL}/books`;
    const req = await fetch(URL)
    const books = await req.json()

    expect(books.length).toBe(0)
});

test('Obtener libros por api', async () => {
	const bookData = {
        title: 'El Aleph',
        synopsis: 'Este volumen reúne dieciocho relatos de Jorge Luis Borges, entre ellos quizá los más elogiados y repetidamente citados. Tanto «El inmortal» como «Los teólogos», «Deutsches Requiem» y «La espera» muestran las posibilidades expresivas de la «estética de la inteligencia» borgiana, inimitable fusión de mentalidad matemática, profundidad metafísica y captación poética del mundo.',
        year: 1949,
        publisher: 'Editorial Losada',
        isbn: '9788499089515',
        genres: ['Cuentos', 'Fantástico'],
        authors: ['Jorge Luis Borges'],
        cover: '/assets/el-aleph.jpg'
    };

    // Creamos el libro
    await BookModels.create(bookData)

    const URL = `${baseURL}/books`;
    const req = await fetch(URL)
    const books = await req.json()

    expect(books.length).toBe(1)
});

test('Buscar libros por api con un resultado', async () => {
	const firstBookData = {
        title: 'The Pragmatic Programmer',
        synopsis: 'Straight from the programming trenches, The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--taking a requirement and producing working, maintainable code that delights its users. It covers topics ranging from personal responsibility and career development to architectural techniques for keeping your code flexible and easy to adapt and reuse.',
        year: 1999,
        publisher: 'Addison-Wesley Professional',
        isbn: '9780201616224',
        genres: ['Educación', 'Tecnología', 'Programación'],
        authors: ['David Thomas', 'Andrew Hunt'],
        cover: '/assets/pragmatic-programmer.jpg'
    };

    const secondBookData = {
        title: 'El Aleph',
        synopsis: 'Este volumen reúne dieciocho relatos de Jorge Luis Borges, entre ellos quizá los más elogiados y repetidamente citados. Tanto «El inmortal» como «Los teólogos», «Deutsches Requiem» y «La espera» muestran las posibilidades expresivas de la «estética de la inteligencia» borgiana, inimitable fusión de mentalidad matemática, profundidad metafísica y captación poética del mundo.',
        year: 1949,
        publisher: 'Editorial Losada',
        isbn: '9788499089515',
        genres: ['Cuentos', 'Fantástico'],
        authors: ['Jorge Luis Borges'],
        cover: '/assets/el-aleph.jpg'
    };

    // Creamos los libros
    await BookModels.create(firstBookData)
    const secondBook = await BookModels.create(secondBookData)

    const URL = `${baseURL}/books?query=aleph`;
    const req = await fetch(URL)
    const books = await req.json()

    expect(books.length).toBe(1)
    expect(secondBook.id).toBe(books[0].id)
});

test('Buscar libros por api sin ningún resultado', async () => {
	const firstBookData = {
        title: 'The Pragmatic Programmer',
        synopsis: 'Straight from the programming trenches, The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--taking a requirement and producing working, maintainable code that delights its users. It covers topics ranging from personal responsibility and career development to architectural techniques for keeping your code flexible and easy to adapt and reuse.',
        year: 1999,
        publisher: 'Addison-Wesley Professional',
        isbn: '9780201616224',
        genres: ['Educación', 'Tecnología', 'Programación'],
        authors: ['David Thomas', 'Andrew Hunt'],
        cover: '/assets/pragmatic-programmer.jpg'
    };

    const secondBookData = {
        title: 'El Aleph',
        synopsis: 'Este volumen reúne dieciocho relatos de Jorge Luis Borges, entre ellos quizá los más elogiados y repetidamente citados. Tanto «El inmortal» como «Los teólogos», «Deutsches Requiem» y «La espera» muestran las posibilidades expresivas de la «estética de la inteligencia» borgiana, inimitable fusión de mentalidad matemática, profundidad metafísica y captación poética del mundo.',
        year: 1949,
        publisher: 'Editorial Losada',
        isbn: '9788499089515',
        genres: ['Cuentos', 'Fantástico'],
        authors: ['Jorge Luis Borges'],
        cover: '/assets/el-aleph.jpg'
    };

    // Creamos los libros
    const firstBook = await BookModels.create(firstBookData)
    const secondBook = await BookModels.create(secondBookData)

    const URL = `${baseURL}/books?query=something`;
    const req = await fetch(URL)
    const books = await req.json()

    expect(books.length).toBe(0)
});

test('Buscar libros por api con más de un resultado', async () => {
	const firstBookData = {
        title: 'The Pragmatic Programmer',
        synopsis: 'Straight from the programming trenches, The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--taking a requirement and producing working, maintainable code that delights its users. It covers topics ranging from personal responsibility and career development to architectural techniques for keeping your code flexible and easy to adapt and reuse.',
        year: 1999,
        publisher: 'Addison-Wesley Professional',
        isbn: '9780201616224',
        genres: ['Educación', 'Tecnología', 'Programación'],
        authors: ['David Thomas', 'Andrew Hunt'],
        cover: '/assets/pragmatic-programmer.jpg'
    };

    const secondBookData = {
        title: 'El Aleph',
        synopsis: 'Este volumen reúne dieciocho relatos de Jorge Luis Borges, entre ellos quizá los más elogiados y repetidamente citados. Tanto «El inmortal» como «Los teólogos», «Deutsches Requiem» y «La espera» muestran las posibilidades expresivas de la «estética de la inteligencia» borgiana, inimitable fusión de mentalidad matemática, profundidad metafísica y captación poética del mundo.',
        year: 1949,
        publisher: 'Editorial Losada',
        isbn: '9788499089515',
        genres: ['Cuentos', 'Fantástico'],
        authors: ['Jorge Luis Borges'],
        cover: '/assets/el-aleph.jpg'
    };

    // Creamos los libros
    await BookModels.create(firstBookData)
    await BookModels.create(secondBookData)

    const URL = `${baseURL}/books?query=978`;
    const req = await fetch(URL)
    const books = await req.json()

    expect(books.length).toBe(2)
});

test('No debería encontrar ningún libro al iniciar la aplicación', async () => {
    const URL = `${baseURL}/books/1`;
    const req = await fetch(URL)
    const status = await req.status

    expect(status).toBe(404)
});

test('Obtener un libro por api', async () => {
	const bookData = {
        title: 'El Aleph',
        synopsis: 'Este volumen reúne dieciocho relatos de Jorge Luis Borges, entre ellos quizá los más elogiados y repetidamente citados. Tanto «El inmortal» como «Los teólogos», «Deutsches Requiem» y «La espera» muestran las posibilidades expresivas de la «estética de la inteligencia» borgiana, inimitable fusión de mentalidad matemática, profundidad metafísica y captación poética del mundo.',
        year: 1949,
        publisher: 'Editorial Losada',
        isbn: '9788499089515',
        genres: ['Cuentos', 'Fantástico'],
        authors: ['Jorge Luis Borges'],
        cover: '/assets/el-aleph.jpg'
    };

    // Creamos el libro
    const book = await BookModels.create(bookData)

    const URL = `${baseURL}/books/1`;
    const req = await fetch(URL)
    const bookReceived = await req.json()

    expect(book.id).toBe(bookReceived.id)
});