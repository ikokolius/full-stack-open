# New note in single page app diagram

```mermaid
sequenceDiagram

participant b as Web Browser
participant s as Web Server

Note over b: User adds and saves a note

Note over b: Javascript(spa.js) rerenders notes so the new one is added<br/> and sends new note data to the server

b ->>+ s: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa <br/>with a payload in JSON format, e.g.<br/> {"content":"New Note","date":"2025-03-26T13:08:09.955Z"}

Note over s: The code on the server responsible for the POST request<br/>saves data

s -->>- b: Response: {"message":"note created"}
```
