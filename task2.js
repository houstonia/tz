const userUrl = 'https://dummyjson.com/users'
let limit = 15;
let usersData = []; // данные о пользователях
let pages = [] // страницы таблицы
let currentPage = 0;
let pageNumber = document.querySelector('.page-number')
let nextPageBtn = document.querySelector('.next-btn')
let prevPageBtn = document.querySelector('.prev-btn')

/**
 * Возвращает список пользователей и передает список в функцию для отрисовки
 *
 * @param limit  - количество запрашиваемых пользователей
 * @param curPage - текущая страница таблицы
 */
async function fetchUsersData(limit, curPage) {
    await fetch(`${userUrl}?limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            usersData = data.users;
        });
    prevPageBtn.disabled = (limit <= 0 || limit == 15)
    nextPageBtn.disabled = usersData.length === 100
    pages = getTablePages(usersData, 15)
    displayUsersData(pages[curPage])
}

/**
 * совершает переход на следующую страницу таблицы
 */
function nextPage() {
    limit += 15
    ++currentPage
    pageNumber.innerText = (currentPage + 1)
    fetchUsersData(limit, currentPage)
}

/**
 * совершает переход на предыдущую страницу таблицы
 */
function prevPage() {
    limit -= 15
    --currentPage
    if (limit <= 0) currentPage = 0
    pageNumber.innerText = (currentPage + 1)
    fetchUsersData(limit, currentPage)
}
/**
 * работает с отображением данных о пользователях в таблице
 * @param data  - данные о пользователях
 */
function displayUsersData(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(user => {
        const fullName = user.lastName + ' ' + user.firstName;
        const row = `<tr onclick="showSidePanel(${user.id})"><td>${user.id}</td><td>${user.username}</td><td>${user.email}</td><td>${fullName}</td><td>${user.birthDate}</td><td>${user.height}</td><td>${user.ip}</td></tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

/**
 * отправляет запрос на получение постов выбранного пользователя, 
 * работает с отображением боковой панели с полученными постами выбранного пользователя
 * @param userId  - идентификатор пользователя
 */
function showSidePanel(userId) {
    clearPosts()
    fetch(`${userUrl}/${userId}/posts`)
        .then(res => res.json())
        .then(data => {
            data.posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.id = 'post';

                const postTitleH2 = document.createElement('h2');
                postTitleH2.id = 'postTitle';
                postTitleH2.innerText = post.title
                postDiv.appendChild(postTitleH2);

                const postTextP = document.createElement('p');
                postTextP.id = 'postText';
                postTextP.innerText = post.body
                postDiv.appendChild(postTextP);
                document.getElementById('sidePanel').appendChild(postDiv)
                document.getElementById('sidePanel').style.display = 'block';
            })
        });
}
/**
 * выполняет очистку постов в боковой панели
 */
function clearPosts() {
    const parentElement = document.getElementById('sidePanel');
    const postElements = parentElement.querySelectorAll('#post');
    postElements.forEach(element => {
        parentElement.removeChild(element)
    })
}
/**
 * закрывает боковую панель
 */
function closeSidePanel() {
    document.getElementById('sidePanel').style.display = 'none';
}
/**
 * возвращает список страниц с данными о пользователях
 * @param users  - данные о пользователях
 * @param limit  - количество данных о пользователях на странице
 */
function getTablePages(users, limit) {
    const tablePages = [];
    for (let i = 0; i < users.length; i += limit) {
        tablePages.push(users.slice(i, i + limit));
    }
    return tablePages;
}
/**
 * конвертирует строку IP в числовое значение, 
 * которое потом используется для сравнения при сортировке.
 */
function ipToNumber(ip) {
    const parts = ip.split(".");
    return parts.reduce((acc, val) => acc * 256 + parseInt(val, 10), 0);
}
// объект usersInfo, где каждое свойство содержит функцию, 
// предназначенную для сортировки массива пользователей 
// по определённому критерию
const usersInfo = {
    'id': function () { return pages[currentPage]?.sort((a, b) => a.id - b.id) },
    'username': function () { return pages[currentPage]?.sort((a, b) => a.username.localeCompare(b.username)) },
    'email': function () { return pages[currentPage]?.sort((a, b) => a.email.localeCompare(b.email)) },
    'fullName': function () { return pages[currentPage]?.sort((a, b) => a.lastName.localeCompare(b.lastName)) },
    'birthDate': function () { return pages[currentPage]?.sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate)) },
    'height': function () { return pages[currentPage]?.sort((a, b) => a.height - b.height) },
    'ip': function () { return pages[currentPage]?.sort((a, b) => ipToNumber(a.ip) - ipToNumber(b.ip)) },
    'email': function () { return pages[currentPage]?.sort((a, b) => a.email.localeCompare(b.email)) },
}
//сортирует и передает  результат в фунцию отображения данных в таблице
const sortTable = (field) => displayUsersData(usersInfo[field]());

fetchUsersData(limit, currentPage);