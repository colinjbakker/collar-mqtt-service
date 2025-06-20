# collar-mqtt-service

MQTT listener, listens to collar locations topic, inserts into supabase when there is a new location

collar-sim simulates a collar, publishes a collar location every five seconds

## usage

set .env variables

MQTT_HOST, MQTT_PORT, MQTT_USERNAME, MQTT_PASSWORD <- all found on mqtt broker page.

SUPABASE_URL <- find by going to Project Settings > Data API > Project URL

SUPABASE_FUNCTION_URL <- submit-location edge function url, go to Edge Functions > submit-location > Details > Endpoint URL

SUPABASE_SERVICE_ROLE_KEY <- super secret key (dont leak) go to Project Settings > API Keys > service_role

MQTT listener: node index.js

Collar sim: node collar-sim.js collarid

collar id needs to exist in the collars table for collar sim to work
