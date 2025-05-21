from PIL import Image
import os

dataset_folder = 'skin-disease-dataset-augmented'

def count_images(folder_path):
    total = 0
    class_counts = {}

    for class_name in os.listdir(folder_path):
        class_folder = os.path.join(folder_path, class_name)
        if os.path.isdir(class_folder):
            num_images = len(os.listdir(class_folder))
            class_counts[class_name] = num_images
            total += num_images

    print(f"\nTotal images in {folder_path}: {total}")
    for class_name, num in class_counts.items():
        print(f"Class {class_name}: {num} images")

# Count images in each dataset
print("\nTrain Set:")
count_images(os.path.join(dataset_folder, 'train_set'))
print("\nTest Set:")
count_images(os.path.join(dataset_folder, 'test_set'))
print("\nValidation Set:")
count_images(os.path.join(dataset_folder, 'validation_set'))
