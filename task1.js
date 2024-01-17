
const collageContainer = document.querySelector('.collage');
const modal = document.querySelector('.modal');
const modalImage = document.querySelector('.modal img');
const closeBtn = document.querySelector('.close-btn');
const downloadBtn = document.querySelector('.download-btn');
let interval;
let images = [];

//получает фотки собаки
function getDogImage() {
  const width = Math.floor((Math.random() * 200) + 500);
  return `https://placedog.net/${width}/${width}`;
}
//добавляет  фотки в коллаж
function addNewImage() {
  const newImg = new Image();
  newImg.src = getDogImage();
  newImg.onload = () => {
    images.unshift(newImg.src);
    if (images.length > 10) {
      images.pop();
    }
    collageContainer.innerHTML = '';
    images.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.classList.add('hidden');
      let imgWidth = Math.floor((Math.random() * 200) + 50)
      let imageHeight = Math.floor((Math.random() * 200) + 50)
      img.width = `${imgWidth}`
      img.height = `${imageHeight}`

      collageContainer.appendChild(img);
      setTimeout(() => {
        img.classList.remove('hidden'); // Удаляем класс для плавного появления
      }, 100);
    });
  };
};


// вызывает модалку
function openModal(src) {
  modalImage.src = src;
  modal.style.display = 'flex';
  clearInterval(interval);
}
// закрывает модалку
function closeModal() {
  modal.style.display = 'none';
  startUpdatingCollage();
}

// возобновляет добавление фоток в коллаж
function startUpdatingCollage() {
  clearInterval(interval);
  interval = setInterval(addNewImage, 3000);
}
// событие на клик картинки  в коллаже, вызывается модалка
collageContainer.addEventListener('click', event => {
  if (event.target.tagName === 'IMG') {
    openModal(event.target.src);
  }
})
// событие на клик на кнопку закрытия модалки
closeBtn.addEventListener('click', closeModal);

// сохранение
downloadBtn.addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = modalImage.src;
  a.download = 'animal_image.jpg';
  a.click();
});

startUpdatingCollage();

