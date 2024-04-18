```mermaid
    sequenceDiagram
    participant browser
    participant server

    browser-->> server: GET html, css, js, json
    activate server
    server-->>browser: 200 OK html, css, js, json
    deactivate server

    note right of browser: The submit button is pressed creating an event that triggers the form.onsubmit function. The function pushes the new note to an array and redraws the javascript to include the new item in the array. The browser then sends the updated entry as JSON to the server.
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->> 201 Created
    deactivate server



```