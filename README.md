# CDex-CommReq-App
Clinical Data Exchange Communication Request Reference Implementation App

## Configure

Update `js/config.js` with your app's OAuth client ID and other related configuration settings.

## Install & Run
Install NodeJS. Then fetch the app dependencies in the app directory and launch the app server:
```sh
npm i
npm start
```

You should see something like

    Starting up http-server, serving ./
    Available on:
        http://127.0.0.1:9090
        http://10.23.49.21:9090

You can stop the server if needed using <kbd>Ctrl+C</kbd>.

At this point your Launch URI is http://127.0.0.1:9090/launch.html and your
Redirect URI is http://127.0.0.1:9090. Please follow the instructions from
http://docs.smarthealthit.org to get this SMART application registered and
configured against your SMART on FHIR server.
