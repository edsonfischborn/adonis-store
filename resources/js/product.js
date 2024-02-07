const imageHighLight = document.querySelector('.product-highlight-image');
const productImages = document.querySelectorAll('.product-image');

if (productImages.length > 0 && imageHighLight) {
  for (let img of productImages) {
    img.addEventListener('click', () => {
      imageHighLight.src = img.src;
      setImageActive();
    });
  }
}

function setImageActive() {
  for (let img of productImages) {
    img.src === imageHighLight.src ? img.classList.add('active') : img.classList.remove('active');
  }
}

setImageActive();
