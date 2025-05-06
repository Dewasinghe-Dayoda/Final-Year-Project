const path = require('path');
const fs = require('fs');
const request = require('supertest');
const app = require('../../server');
const imagePath = path.join(__dirname, '../../tests/test_images/test-image.png');
console.log('Resolved Image Path:', imagePath);  // Log the resolved path

describe('Skin Prediction System', function () {
    this.timeout(15000); // Set a higher timeout for async operations

    let token;

    before(async () => {
        // Log in to get the token
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password'
            });

        token = res.body.token;
    });

    it('should complete end-to-end prediction', async () => {
        const imagePath = path.resolve(__dirname, '../../tests/test_images/test-image.png');  // Absolute path

        // Check if the image file exists
        if (!fs.existsSync(imagePath)) {
            throw new Error('Test image not found at ' + imagePath);
        }

        console.log(`Image found at: ${imagePath}`);

        // Make the POST request to the /predict endpoint
        const response = await request(app)
            .post('/api/predict')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', imagePath); // Ensure the field name is 'file' as per the backend API

        // Check if the response is as expected
        if (response.status !== 200) {
            console.error('Error response:', response.body);
        }

        // Validate the response body
        if (!response.body.disease || !response.body.class || !response.body.confidence) {
            throw new Error('Prediction not returned correctly. Response: ' + JSON.stringify(response.body));
        }

        console.log(`Prediction Result: ${response.body.disease}, Confidence: ${response.body.confidence}`);

        // Mocha assertion style
        require('assert').strictEqual(response.status, 200);
        require('assert').strictEqual(response.body.message, 'Success');
        require('assert').strictEqual(response.body.disease, 'Cellulitis'); // Update this to match expected disease if needed
    });
});
