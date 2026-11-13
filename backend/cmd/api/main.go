package main

import (
    "fmt"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, `{"status":"ok"}`)
    })
    log.Println("API listening on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
