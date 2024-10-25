# nr-co2meter
Node-RED integration for tracking CO2 emissions based on electricity meter readings using the [CO2 Meter API](https://console.corrently.io/co2meter.html).


## Hint
Make sure you have uncommented the following in your Node-RED settings.js file:
```
contextStorage: {
        default: {
            module:"localfilesystem"
        },
    },
```

If not, you will loose your meters every time you restart Node-RED.
