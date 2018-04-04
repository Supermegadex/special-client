import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name;
  answer;
  token;
  question;
  nameEntered = false;
  url = 'https://supermegadex-special.now.sh';
  // url = 'http://localhost:3000';

  constructor() {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      this.token = currentToken;
    }
  }

  getCurrentQuestion() {
    fetch(this.url, {
      body: JSON.stringify({
        name: this.name,
        token: this.token,
        ask: true
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      mode: 'cors'
    }).then(data => data.json())
      .then(d => {
        this.updateToken(d.token);
        this.question = d.question;
      })
      .catch(err => console.error(err));
  }

  start() {
    this.nameEntered = true;
    this.getCurrentQuestion();
  }

  updateToken(token) {
    localStorage.setItem('token', token);
    this.token = token;
  }

  submitAnswer() {
    fetch(this.url, {
      body: JSON.stringify({
        name: this.name,
        token: this.token,
        ask: false,
        answer: this.answer
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      mode: 'cors'
    }).then(data => data.json())
      .then(d => {
        if (d.correct) {
          this.updateToken(d.token);
          this.question = d.nextQuestion;
        }
      })
      .catch(err => console.error(err));
  }
}
