import os
import random
import shutil
import numpy as np 
from PIL import Image
from tensorflow.keras.preprocessing.image import ImageDataGenerator # type: ignore

def augment_images(class_folder, target_count):
    """
    Augments images in the given class folder until the total count reaches target_count.
    """
    image_files = [f for f in os.listdir(class_folder) if f.endswith('.jpg')]
    num_original_images = len(image_files)

    if num_original_images >= target_count:
        print(f"Skipping {class_folder}, already has {num_original_images} images.")
        return

    datagen = ImageDataGenerator(
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )

    images_needed = target_count - num_original_images
    print(f"Augmenting {class_folder}: Adding {images_needed} images.")

    i = 0
    while images_needed > 0:
        img_name = random.choice(image_files)
        img_path = os.path.join(class_folder, img_name)
        img = Image.open(img_path)
        img_array = np.array(img)  # No more error

        augmented_images = datagen.flow(
            img_array.reshape((1,) + img_array.shape),
            batch_size=1
        )

        for batch in augmented_images:
            new_img = Image.fromarray(batch[0].astype('uint8'))
            new_filename = f"aug_{i}_{img_name}"
            new_img.save(os.path.join(class_folder, new_filename))
            images_needed -= 1
            i += 1

            if images_needed == 0:
                break

# Paths
train_set_path = "skin-disease-dataset-augmented/train_set"

# Find max class count
class_counts = {cls: len(os.listdir(os.path.join(train_set_path, cls))) for cls in os.listdir(train_set_path)}
max_class_count = max(class_counts.values())

# Perform augmentation for underrepresented classes
for class_name, count in class_counts.items():
    class_folder = os.path.join(train_set_path, class_name)
    augment_images(class_folder, max_class_count)

print("Dataset is now balanced.")
