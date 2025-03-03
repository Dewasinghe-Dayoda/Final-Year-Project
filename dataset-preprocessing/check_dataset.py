from PIL import Image
import os
# checking if all the images are 128x128 and jpg
# def check_images(folder_path):
#     incorrect_images = []
    
#     for root, _, files in os.walk(folder_path):
#         for file in files:
#             img_path = os.path.join(root, file)
#             try:
#                 with Image.open(img_path) as img:
#                     if img.size != (128, 128) or img.format != 'JPEG':
#                         incorrect_images.append((img_path, img.size, img.format))
#             except Exception as e:
#                 print(f"Error opening {img_path}: {e}")

#     if incorrect_images:
#         print("Images that do not match 128x128 and JPG format:")
#         for img_path, size, img_format in incorrect_images:
#             print(f"{img_path} - Size: {size}, Format: {img_format}")
#     else:
#         print("All images are correctly formatted (128x128 JPG).")

# # Check all datasets
dataset_folder = 'skin-disease-dataset'
# print("\nChecking Train Set:")
# check_images(os.path.join(dataset_folder, 'train_set'))
# print("\nChecking Test Set:")
# check_images(os.path.join(dataset_folder, 'test_set'))
# print("\nChecking Validation Set:")
# check_images(os.path.join(dataset_folder, 'validation_set'))

#checking number of iages in each dataset 
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
