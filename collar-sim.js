import mqtt from 'mqtt';
import dotenv from 'dotenv';
import { createClient } from "@supabase/supabase-js";

/**
 * Usage: node collar-sim.js collarId
 */

dotenv.config();

const args = process.argv.slice(2);
const [collarId] = args;
console.log(collarId);
const options = {
    protocol: 'mqtts',
    host: process.env.MQTT_HOST,
    port: parseInt(process.env.MQTT_PORT),
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
};
const mqttClient = mqtt.connect(options);
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await supabase
  .from('collar_locations')
  .select(
    `
    latitude,
    longitude
    `,
  )
  .eq('collar_id', collarId)
  .order('loc_time', {
    ascending: false,
  })
  .limit(1);

if(error){
    console.error("error starting", error);
}
else{
    mqttClient.on('connect', function () {
    console.log('Connected');
    });

    mqttClient.on('error', function (error) {
        console.log(error);
    });

    let lat = data[0].latitude;
    let lon = data[0].longitude;

    async function sendLocation() {
        lat += (Math.random() - 0.5) * 0.001;
        lon += (Math.random() - 0.5) * 0.001;

        try {
            await publishAsync(
                `collar/${collarId}/location`,
                JSON.stringify({
                    "collar_id": collarId,
                    "latitude": lat,
                    "longitude": lon,
                    "timestamp": new Date().toISOString(),}), 
                {qos: 1}
            );
            console.log('published');
        } catch (err) {
            console.log("error publishing", err);
        }
    }
    setInterval(sendLocation, 5000);
}

function publishAsync(topic, message, options = {}) {
    return new Promise((resolve, reject) => {
        mqttClient.publish(topic, message, options, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}



