from PIL import Image
import os
import shutil
from sklearn.model_selection import train_test_split

def convert_images_to_jpg(folder_path):
    """
    Convert all images in the folder to .jpg format.
    """
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(('.jpeg', '.png', '.webp')):
                img_path = os.path.join(root, file)
                img = Image.open(img_path)
                new_path = os.path.splitext(img_path)[0] + '.jpg'
                img.convert('RGB').save(new_path, 'JPEG')
                os.remove(img_path)  # Remove the original file
                print(f"Converted {img_path} to {new_path}")

def resize_images(folder_path, size=(128, 128)):
    """
    Resize all images in the folder to the specified size.
    """
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            img_path = os.path.join(root, file)
            img = Image.open(img_path)
            img = img.resize(size)
            img.save(img_path)
            print(f"Resized {img_path} to {size}")

def split_train_validation(train_folder, validation_folder, test_size=0.2):
    """
    Split the train_set into train and validation sets.
    """
    for class_name in os.listdir(train_folder):
        class_folder = os.path.join(train_folder, class_name)
        images = os.listdir(class_folder)
        train_images, validation_images = train_test_split(images, test_size=test_size, random_state=42)

        # Create train and validation folders
        train_class_folder = os.path.join(train_folder, class_name)
        validation_class_folder = os.path.join(validation_folder, class_name)
        os.makedirs(validation_class_folder, exist_ok=True)

        # Move validation images
        for img in validation_images:
            src = os.path.join(class_folder, img)
            dst = os.path.join(validation_class_folder, img)
            shutil.move(src, dst)
            print(f"Moved {src} to {dst}")

# Path dataset folder
dataset_folder = 'skin-disease-dataset-augmented'

# Step 1: Convert all images to .jpg
convert_images_to_jpg(os.path.join(dataset_folder, 'train_set'))
convert_images_to_jpg(os.path.join(dataset_folder, 'test_set'))

# Step 2: Resize all images to 128x128 pixels
resize_images(os.path.join(dataset_folder, 'train_set'), size=(128, 128))
resize_images(os.path.join(dataset_folder, 'test_set'), size=(128, 128))

# Step 3: Split train_set into train and validation sets
validation_folder = os.path.join(dataset_folder, 'validation_set')
os.makedirs(validation_folder, exist_ok=True)
split_train_validation(os.path.join(dataset_folder, 'train_set'), validation_folder)