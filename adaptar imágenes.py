import os
from PIL import Image

def resize_images(directory, size):
    for filename in os.listdir(directory):
        try:
            if filename.endswith(".jpg") or filename.endswith(".jpeg") or filename.endswith(".png") or filename.endswith(".webp"):
                image = Image.open(os.path.join(directory, filename))
                image = image.resize(size, Image.LANCZOS)
                image.save(os.path.join(directory, filename))
        except UnicodeEncodeError:
            print(f"No funciona:  {filename}")

if __name__ == '__main__':
    width = 270
    height = 360
    directory = r"./img/Directors"
    size = (width, height)
    resize_images(directory, size)

