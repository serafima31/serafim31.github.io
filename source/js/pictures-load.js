const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'svg'];

const loadImg = (input, preview) => {
  input.addEventListener('change', () => {
    const file = input.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some((item) => {
      return fileName.endsWith(item);
    });

    if (matches) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  })
}

const resetPreviewImg = (preview, imageSrc) => {
  preview.src = imageSrc;
}

export { loadImg, resetPreviewImg }
