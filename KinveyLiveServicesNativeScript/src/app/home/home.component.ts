import { Component, OnInit } from "@angular/core";
import { Kinvey } from 'kinvey-nativescript-sdk';

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Initialize Kinvey.
        Kinvey.init({
            appKey: '',
            appSecret: ''
        });

        // Test connection.
        Kinvey.ping()
            .then((response) => {
                console.log(`Kinvey Ping Success. Kinvey Service is alive, version: ${response.version}, response: ${response.kinvey}`);
            })
            .catch((error) => {
                console.log(`Kinvey Ping Failed. Response: ${JSON.stringify(error)}`);
            });

        // Check for an active user.    
        const activeUser = Kinvey.User.getActiveUser();
        if (!activeUser) {
            Kinvey.User.login('', '')
                .then((user: Kinvey.User) => {
                    this.connectLiveService(user);
                })
                .catch((error: Kinvey.BaseError) => {
                    console.log(`Kinvey login Failed. Response: ${JSON.stringify(error)}`);
                });
        } else {
            this.connectLiveService(activeUser);
        }
    }

    connectLiveService(usertToConnect) {
        usertToConnect.registerForLiveService()
            .then(() => {
                this.subscribeCollection();
            })
            .catch(error => {
                console.log(`Kinvey connecting to Live Services failed. Response: ${JSON.stringify(error)}`);
            });
    }

    subscribeCollection() {
        const books = Kinvey.DataStore.collection('Books', Kinvey.DataStoreType.Network);
        books.subscribe({
            onMessage: (m) => {
                console.log(`Kinvey Books collection onMessage: ${JSON.stringify(m)}`);
            },
            onStatus: (s) => {
                console.log(`Kinvey Books collection onStatus: ${JSON.stringify(s)}`);
            },
            onError: (error) => {
                console.log(`Kinvey Books collection onError: ${JSON.stringify(error)}`);
            }
        })
            .then(() => {
                console.log(`Kinvey successfully subscribed to Books collection!`);
            })
            .catch(error => {
                console.log(`Kinvey subscribing to Books collection failed. Response: ${JSON.stringify(error)}`);
            });
    }
}