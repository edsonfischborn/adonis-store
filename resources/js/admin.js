const modalInputImages = document.querySelector('#adminProductModal [modal-input-images]');
const modalImages = document.querySelector('#adminProductModal [modal-node-images]');
const data = new DataTransfer();

// Start input file multiple with images. Edit product case.
if (modalImages.childNodes.length > 0) {
  const images = document.querySelectorAll('.modal-input-image');

  async function getImages() {
    for (img of images) {
      const response = await fetch(img.src);
      const blob = await response.blob();
      const name = img.getAttribute('filename');
      const file = new File([blob], name, { type: blob.type });

      data.items.add(file);
    }

    modalInputImages.files = data.files;

    document
      .querySelectorAll('.modal-input-image-container')
      .forEach((elm) => addRemoveImageEvent(elm));
  }

  getImages();
}

// Define input file multiple event. To add new image
modalInputImages.addEventListener('change', (input) => {
  Array.from(input.target.files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.classList.add('modal-input-image', 'mt-2', 'me-2', 'img-fluid');
      image.src = String(reader.result);
      image.setAttribute('filename', file.name);

      const container = document.createElement('div');
      container.classList.add('modal-input-image-container');

      container.appendChild(image);
      addRemoveImageEvent(container);
      modalImages.appendChild(container);

      data.items.add(file);
      modalInputImages.files = data.files;
    };

    reader.readAsDataURL(file);
  });
});

function addRemoveImageEvent(imageContainer) {
  imageContainer.addEventListener('click', (container) => {
    for (let i = 0; i < data.items.length; i++) {
      const img = [...imageContainer.childNodes].find((elm) => elm.nodeName === 'IMG');
      if (data.files[i].name == img.getAttribute('filename')) {
        data.items.remove(i);
      }
    }

    container.target.remove();
    modalInputImages.files = data.files;
  });
}
