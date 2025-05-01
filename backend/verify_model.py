import tensorflow as tf

# Load your saved model
model = tf.keras.models.load_model('skinproscan_224_tfjs_model/model.json')  # Update path if needed

# Print model architecture
print("Model input shape:", model.input_shape)  # Should be (None, 224, 224, 3)
print("Model output shape:", model.output_shape)
print("Model summary:")
model.summary()

# Test with dummy data
import numpy as np
dummy_input = np.random.rand(1, 224, 224, 3)
prediction = model.predict(dummy_input)
print("Prediction shape:", prediction.shape)
print("Sample prediction:", prediction[0])