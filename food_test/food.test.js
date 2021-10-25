const client = require('./client')('localhost', 8000)

/**
 * Food is represented by a json with a following format
 * {'name':'name of the food', 'calories': 10 }
 * When a food is created it will get a randomly generated id 
 * and a food becomes
 * {'name':'name of the food', 'calories': 10, 'id': 'abcd1234' }
 */

describe('Food tests', () => {
    it('should return an error when a the foods name is missing', async () => {
 
        const postResponse = await client.post('/api/food', {'calories': 100})

        expect(postResponse.code).toBe(400)
    })

    it('should return an error when the foods nutritional value is missing', async () => {
        
        const postResponse = await client.post('/api/food', {'name': 'cake'})

        expect(postResponse.code).toBe(400)
    })

    it('should return an error when the nutritional value is negative', async () => {
         
        const postResponse = await client.post('/api/food', {'name': 'cake', 'calories': -50})

        expect(postResponse.code).toBe(400)
    })

    it('should be able to get back elements with a get request', async () => {
        let cake = {'name': 'cake', 'calories': 150};
        let notCake = {'name': 'notCake', 'calories': 75};

        const cakeResponse = await client.post('/api/food', cake);
        let cakeId = JSON.parse(cakeResponse.body).id;
        const notCakeResponse = await client.post('/api/food', notCake);
        let notCakeId = JSON.parse(notCakeResponse.body).id;

        const getResponse = await client.get('/api/food');
        expect(getResponse.code).toBe(200);

        const getResponseBody = JSON.parse(getResponse.body);

        cake.id = cakeId;
        notCake.id = notCakeId;

        expect(getResponseBody).toContainEqual(cake);
        expect(getResponseBody).toContainEqual(notCake);

        client.delete('/api/food/' + cakeId);
        client.delete('/api/food/' + notCakeId);
        
    })

    it('should get the elements back when searched by id', async () => {
        let cake = {'name': 'cake', 'calories': 150};

        const cakeResponse = await client.post('/api/food', cake);
        let cakeId = JSON.parse(cakeResponse.body).id;

        const getResponse = await client.get('/api/food/' + cakeId);
        expect(getResponse.code).toBe(200);

        const getResponseBody = JSON.parse(getResponse.body);

        cake.id = cakeId;

        expect(getResponseBody).toStrictEqual(cake);

        client.delete('/api/food/' + cakeId);

    })

    it('should get an error when sending unused id', async () => {
        let cake = {'name': 'cake', 'calories': 150};

        const cakeResponse = await client.post('/api/food', cake);
        let cakeId = 1;

        const getResponse = await client.get('/api/food/' + cakeId);
        expect(getResponse.code).toBe(404);

    })
})