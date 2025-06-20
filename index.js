import mqtt from 'mqtt';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const options = {
    protocol: 'mqtts',
    host: process.env.MQTT_HOST,
    port: parseInt(process.env.MQTT_PORT),
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
};

const client = mqtt.connect(options);

client.on('connect', function () {
    console.log('Connected');
    client.subscribe('collar/+/location');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', async function (topic, message) {
    try {
        const data = JSON.parse(message.toString());
        console.log("Message:", topic, data);

        await axios.post(process.env.SUPABASE_FUNCTION_URL, data, {
            headers: {
                Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            },
        });

        console.log("Inserted into Supabase");
    }
    catch(err){
        console.error("Error:", err);
    }
});